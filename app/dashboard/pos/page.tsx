"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Minus,
  Search, 
  ShoppingCart,
  Trash2,
  User,
  CreditCard,
  Banknote,
  Receipt,
  X,
  Package,
  Wifi,
  WifiOff,
  RotateCw,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomerSelector } from "@/components/pos/customer-selector";
import { QuickAmountButtons } from "@/components/pos/quick-amount-buttons";
import { POSCalculator, DiscountType, SellType } from "@/lib/pos-calculator";
import { useOffline } from "@/hooks/use-offline";
import type { Customer } from "@/types/customer";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; // Giá per đơn vị
  priceUnit: string; // Đơn vị giá (100g, 1kg, 1 lít, 1 bó, 1 hộp...)
  stock: number; // Số lượng tồn kho
  stockUnit: string; // Đơn vị kho (g, kg, ml, lít, con, bó, hộp, gói...)
  sellType: SellType; // Loại bán
  allowCustomQuantity: boolean; // Cho phép nhập số lượng tùy chỉnh
  minQuantity?: number; // Số lượng tối thiểu
  maxQuantity?: number; // Số lượng tối đa mỗi lần mua
  quantityStep?: number; // Bước nhảy số lượng (vd: chỉ bán theo 100g, 500ml...)
  status: string;
  image: string | null;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number; // Số lượng theo đơn vị của sản phẩm
  actualQuantity?: number; // Số lượng thực tế bán (vd: vỉ trứng 10 quả nhưng chỉ bán 7 quả)
  unitPrice: number; // Giá đã tính theo quantity thực tế
  originalPrice: number; // Giá gốc trước khi áp dụng discount
  discountType?: DiscountType; // Loại giảm giá
  discountValue?: number; // Giá trị giảm (% hoặc số tiền)
  discountReason?: string; // Lý do giảm giá
  finalPrice: number; // Giá cuối cùng sau discount
}

export default function POSPage() {  // Offline capability
  const {
    isOnline,
    syncStatus,
    saveTransaction
  } = useOffline();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [receivedAmount, setReceivedAmount] = useState<string>("");const [quantityInputModal, setQuantityInputModal] = useState<{show: boolean, product: Product | null}>({show: false, product: null});
  const [quantityInput, setQuantityInput] = useState<string>("");
  const [showCart, setShowCart] = useState(false); // Mobile cart visibility
  
  // Actual quantity modal (vỉ trứng bán 7/10 quả)
  const [actualQuantityModal, setActualQuantityModal] = useState<{show: boolean, cartItem: CartItem | null}>({show: false, cartItem: null});
  const [actualQuantityInput, setActualQuantityInput] = useState<string>("");
    // Discount & Adjustment states
  const [discountModal, setDiscountModal] = useState<{show: boolean, cartItem: CartItem | null}>({show: false, cartItem: null});
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<string>("");
  const [discountReason, setDiscountReason] = useState<string>("");

  // Loading states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Refs for auto-focus
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const actualQuantityInputRef = useRef<HTMLInputElement>(null);
  const discountValueInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus effects
  useEffect(() => {
    if (quantityInputModal.show && quantityInputRef.current) {
      setTimeout(() => quantityInputRef.current?.focus(), 100);
    }
  }, [quantityInputModal.show]);

  useEffect(() => {
    if (actualQuantityModal.show && actualQuantityInputRef.current) {
      setTimeout(() => actualQuantityInputRef.current?.focus(), 100);
    }
  }, [actualQuantityModal.show]);

  useEffect(() => {
    if (discountModal.show && discountValueInputRef.current) {
      setTimeout(() => discountValueInputRef.current?.focus(), 100);
    }
  }, [discountModal.show]);

  // ESC key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (quantityInputModal.show) closeQuantityModal();
        if (actualQuantityModal.show) closeActualQuantityModal();
        if (discountModal.show) closeDiscountModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [quantityInputModal.show, actualQuantityModal.show, discountModal.show]);

  // Mock data - Sản phẩm thực phẩm đa dạng đơn vị bán hàng
  const [products, setProducts] = useState<Product[]>([
    // Rau củ quả - bán theo bó/buồng
    {
      id: "1",
      name: "Rau cải bó xôi hữu cơ",
      sku: "RAU001",
      category: "Rau hữu cơ",
      price: 45000,
      priceUnit: "1 bó",
      stock: 25,
      stockUnit: "bó",
      sellType: 'bundle',
      allowCustomQuantity: false,
      status: "active",
      image: null,
      description: "Rau cải bó xôi hữu cơ tươi ngon"
    },
    // Hải sản - bán theo trọng lượng
    {
      id: "2", 
      name: "Cá hồi Na Uy fillet",
      sku: "FISH001",
      category: "Hải sản đông lạnh",
      price: 350000,
      priceUnit: "1kg",
      stock: 3000, // 3kg = 3000g
      stockUnit: "g",
      sellType: 'weight',
      allowCustomQuantity: true,
      minQuantity: 100,
      maxQuantity: 1000,
      quantityStep: 50,
      status: "active",
      image: null,
      description: "Cá hồi Na Uy fillet cao cấp"
    },
    // Thịt - bán theo trọng lượng
    {
      id: "3",
      name: "Thịt bò Kobe A5 Wagyu",
      sku: "BEEF001",
      category: "Thịt đông lạnh",
      price: 1200000,
      priceUnit: "1kg",
      stock: 2500, // 2.5kg = 2500g
      stockUnit: "g",
      sellType: 'weight',
      allowCustomQuantity: true,
      minQuantity: 200,
      maxQuantity: 1500,
      quantityStep: 100,
      status: "active",
      image: null,
      description: "Thịt bò Kobe A5 Wagyu nhập khẩu"
    },
    // Trái cây - bán theo trọng lượng
    {
      id: "4",
      name: "Nho đỏ không hạt Mỹ",
      sku: "FRUIT001", 
      category: "Trái cây nhập khẩu",
      price: 180000,
      priceUnit: "1kg",
      stock: 5000, // 5kg = 5000g
      stockUnit: "g",
      sellType: 'weight',
      allowCustomQuantity: true,
      minQuantity: 250,
      maxQuantity: 2000,
      quantityStep: 250,
      status: "active",
      image: null,
      description: "Nho đỏ không hạt Mỹ cao cấp"
    },
    // Hải sản tươi sống - bán theo con
    {
      id: "5",
      name: "Tôm hùm Alaska sống",
      sku: "LOBSTER001",
      category: "Hải sản tươi sống",
      price: 750000,
      priceUnit: "1 con",
      stock: 3, // 3 con
      stockUnit: "con",
      sellType: 'piece',
      allowCustomQuantity: false,
      status: "active",
      image: null,
      description: "Tôm hùm Alaska tươi sống cao cấp"
    },
    // Rau - bán theo trọng lượng
    {
      id: "6",
      name: "Măng tây xanh hữu cơ",
      sku: "VEG001",
      category: "Rau hữu cơ",
      price: 240000,
      priceUnit: "1kg",
      stock: 1500, // 1.5kg = 1500g
      stockUnit: "g",
      sellType: 'weight',
      allowCustomQuantity: true,
      minQuantity: 100,
      maxQuantity: 500,
      quantityStep: 100,
      status: "active",
      image: null,
      description: "Măng tây xanh hữu cơ tươi giòn"
    },
    // Nước uống - bán theo thể tích
    {
      id: "7",
      name: "Nước cam tươi 100%",
      sku: "JUICE001",
      category: "Nước uống",
      price: 45000,
      priceUnit: "500ml",
      stock: 2000, // 2 lít = 2000ml
      stockUnit: "ml",
      sellType: 'volume',
      allowCustomQuantity: true,
      minQuantity: 250,
      maxQuantity: 1000,
      quantityStep: 250,
      status: "active",
      image: null,
      description: "Nước cam tươi vắt 100% không đường"
    },
    // Trứng - bán theo vỉ
    {
      id: "8",
      name: "Trứng gà ta hữu cơ",
      sku: "EGG001",
      category: "Trứng & sữa",
      price: 85000,
      priceUnit: "1 vỉ (10 quả)",
      stock: 15, // 15 vỉ
      stockUnit: "vỉ",
      sellType: 'pack',
      allowCustomQuantity: false,
      status: "active",
      image: null,
      description: "Trứng gà ta hữu cơ size lớn"
    },
    // Sữa - bán theo thể tích
    {
      id: "9",
      name: "Sữa tươi organic",
      sku: "MILK001",
      category: "Trứng & sữa",
      price: 95000,
      priceUnit: "1 lít",
      stock: 3000, // 3 lít = 3000ml
      stockUnit: "ml",
      sellType: 'volume',
      allowCustomQuantity: true,
      minQuantity: 500,
      maxQuantity: 2000,
      quantityStep: 500,
      status: "active",
      image: null,
      description: "Sữa tươi organic từ nông trại xanh"
    },
    // Snack - bán theo gói
    {
      id: "10",
      name: "Khoai tây chiên vị BBQ",
      sku: "SNACK001",
      category: "Đồ khô",
      price: 25000,
      priceUnit: "1 gói (150g)",
      stock: 20, // 20 gói
      stockUnit: "gói",
      sellType: 'pack',
      allowCustomQuantity: false,
      status: "active",
      image: null,
      description: "Khoai tây chiên giòn rụm vị BBQ"
    }
  ]);

  // Lọc sản phẩm theo search và category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Danh sách categories
  const categories = [
    { id: "all", name: "Tất cả", count: products.length },
    { id: "Rau hữu cơ", name: "Rau hữu cơ", count: products.filter(p => p.category === "Rau hữu cơ").length },
    { id: "Hải sản đông lạnh", name: "Hải sản đông lạnh", count: products.filter(p => p.category === "Hải sản đông lạnh").length },
    { id: "Hải sản tươi sống", name: "Hải sản tươi sống", count: products.filter(p => p.category === "Hải sản tươi sống").length },
    { id: "Thịt đông lạnh", name: "Thịt đông lạnh", count: products.filter(p => p.category === "Thịt đông lạnh").length },
    { id: "Trái cây nhập khẩu", name: "Trái cây nhập khẩu", count: products.filter(p => p.category === "Trái cây nhập khẩu").length },
    { id: "Nước uống", name: "Nước uống", count: products.filter(p => p.category === "Nước uống").length },
    { id: "Trứng & sữa", name: "Trứng & sữa", count: products.filter(p => p.category === "Trứng & sữa").length },
    { id: "Đồ khô", name: "Đồ khô", count: products.filter(p => p.category === "Đồ khô").length }
  ];
  const formatPrice = (price: number) => {
    return POSCalculator.formatPrice(price);
  };

  // Tính tồn kho khả dụng (trừ đi số lượng đã có trong giỏ hàng)
  const getAvailableStock = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    
    const cartItem = cart.find(item => item.product.id === productId);
    const reservedQuantity = cartItem ? cartItem.quantity : 0;
    
    return product.stock - reservedQuantity;
  };

  // Trừ kho thực tế khi checkout thành công
  const updateProductStock = (productId: string, soldQuantity: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: Math.max(0, product.stock - soldQuantity) }
          : product
      )
    );
  };

  // Mở modal nhập số lượng
  const openQuantityModal = (product: Product) => {
    setQuantityInputModal({ show: true, product });
    setQuantityInput(product.minQuantity?.toString() || "1");
  };

  // Đóng modal nhập số lượng
  const closeQuantityModal = () => {
    setQuantityInputModal({ show: false, product: null });
    setQuantityInput("");
  };
  // Mở actual quantity modal
  const openActualQuantityModal = (cartItem: CartItem) => {
    setActualQuantityModal({ show: true, cartItem });
    // Lấy số lượng thành phần trong 1 đơn vị (vd: vỉ trứng 10 quả)
    const unitsInPack = POSCalculator.extractUnitsFromPriceUnit(cartItem.product.priceUnit);
    setActualQuantityInput((cartItem.actualQuantity || (cartItem.quantity * unitsInPack)).toString());
  };

  // Đóng actual quantity modal
  const closeActualQuantityModal = () => {
    setActualQuantityModal({ show: false, cartItem: null });
    setActualQuantityInput("");
  };
  // Áp dụng actual quantity
  const applyActualQuantity = () => {
    if (!actualQuantityModal.cartItem) return;
    
    const actualQty = parseInt(actualQuantityInput);
    const validationError = POSCalculator.validateQuantity(actualQty);
    if (validationError) {
      alert(validationError);
      return;
    }

    const cartItem = actualQuantityModal.cartItem;
    const product = cartItem.product;
    
    // Lấy số lượng thành phần trong 1 đơn vị (vd: vỉ trứng 10 quả)
    const unitsInPack = POSCalculator.extractUnitsFromPriceUnit(product.priceUnit);
    const maxActualQty = cartItem.quantity * unitsInPack;
    
    if (actualQty > maxActualQty) {
      alert(`Số lượng thực tế không được vượt quá ${maxActualQty} ${product.stockUnit.replace('vỉ', 'quả')}`);
      return;
    }

    // Tính giá mới dựa trên số lượng thực tế
    const newPrice = POSCalculator.calculateActualQuantityPrice(
      cartItem.originalPrice, 
      maxActualQty, 
      actualQty
    );

    setCart(prev => 
      prev.map(item => 
        item.product.id === cartItem.product.id
          ? {
              ...item,
              actualQuantity: actualQty,
              originalPrice: newPrice,
              finalPrice: item.discountType ? 
                POSCalculator.calculateDiscountedPrice(newPrice, item.discountType, item.discountValue || 0) : 
                newPrice
            }
          : item
      )
    );

    closeActualQuantityModal();
  };
  // Lấy quick buttons dựa trên loại sản phẩm
  const getQuickButtons = (product: Product) => {
    return POSCalculator.getQuickAmounts(product.sellType);
  };
  // Tính giá dựa trên loại sản phẩm và số lượng
  const calculatePrice = (product: Product, quantity: number) => {
    return POSCalculator.calculateProductPrice(product, quantity);
  };
  // ...existing code...

  // Mở discount modal
  const openDiscountModal = (cartItem: CartItem) => {
    setDiscountModal({ show: true, cartItem });
    setDiscountType('percentage');
    setDiscountValue("");
    setDiscountReason("");
  };

  // Đóng discount modal
  const closeDiscountModal = () => {
    setDiscountModal({ show: false, cartItem: null });
    setDiscountType('percentage');
    setDiscountValue("");
    setDiscountReason("");
  };  // Áp dụng discount
  const applyDiscount = async () => {
    if (!discountModal.cartItem) return;
    
    setIsApplyingDiscount(true);
    
    try {
      const value = parseFloat(discountValue);
      const validationError = POSCalculator.validateDiscount(discountType, value, discountModal.cartItem.originalPrice);
      if (validationError) {
        alert(validationError);
        return;
      }

      // Simulate small delay for UX
      await new Promise(resolve => setTimeout(resolve, 300));

      setCart(prev => 
        prev.map(item => 
          item.product.id === discountModal.cartItem?.product.id
            ? {
                ...item,
                discountType,
                discountValue: value,
                discountReason: discountReason || POSCalculator.getDefaultDiscountReason(discountType, value),
                finalPrice: POSCalculator.calculateDiscountedPrice(item.originalPrice, discountType, value)
              }
            : item
        )
      );

      closeDiscountModal();
    } catch (error) {
      console.error('Error applying discount:', error);
      alert('Có lỗi xảy ra khi áp dụng giảm giá');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  // ...existing code...

  // Xóa discount
  const removeDiscount = (productId: string) => {
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId
          ? {
              ...item,
              discountType: undefined,
              discountValue: undefined,
              discountReason: undefined,
              finalPrice: item.originalPrice
            }
          : item
      )
    );
  };
  // Xử lý thêm sản phẩm với số lượng từ modal
  const handleAddWithQuantity = () => {
    if (!quantityInputModal.product) return;
    
    const quantity = parseFloat(quantityInput);
    const product = quantityInputModal.product;
    const availableStock = getAvailableStock(product.id);
    
    const validationError = POSCalculator.validateQuantity(
      quantity, 
      product.minQuantity, 
      product.maxQuantity, 
      availableStock
    );
    
    if (validationError) {
      alert(validationError);
      return;
    }

    addToCart(product, quantity);
    closeQuantityModal();
  };
  const addToCart = (product: Product, customQuantity?: number) => {
    // Nếu sản phẩm cho phép nhập số lượng tùy chỉnh và chưa có customQuantity, mở modal
    if (product.allowCustomQuantity && !customQuantity) {
      openQuantityModal(product);
      return;
    }
    
    const quantity = customQuantity || 1;
    
    // Kiểm tra tồn kho khả dụng
    const availableStock = getAvailableStock(product.id);
    if (quantity > availableStock) {
      const unit = product.stockUnit;
      alert(`Không đủ hàng trong kho. Còn lại: ${availableStock} ${unit}`);
      return;
    }

    const unitPrice = calculatePrice(product, quantity);
    
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const newUnitPrice = calculatePrice(product, newQuantity);
        
        return prev.map(item =>
          item.product.id === product.id
            ? { 
                ...item, 
                quantity: newQuantity, 
                unitPrice: newUnitPrice,
                originalPrice: newUnitPrice,
                finalPrice: newUnitPrice
              }
            : item
        );
      }
      return [...prev, { 
        product, 
        quantity, 
        unitPrice,
        originalPrice: unitPrice,
        finalPrice: unitPrice
      }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Kiểm tra tồn kho khả dụng
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentCartItem = cart.find(item => item.product.id === productId);
    if (!currentCartItem) return;
    
    // Tính tồn kho khả dụng (bao gồm số lượng hiện tại trong giỏ)
    const availableStock = product.stock - (cart.reduce((total, item) => 
      item.product.id === productId ? 0 : total + item.quantity
    , 0));
    
    if (newQuantity > availableStock) {
      const unit = product.stockUnit;
      alert(`Không đủ hàng trong kho. Tối đa: ${availableStock} ${unit}`);
      return;
    }
      setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const unitPrice = calculatePrice(item.product, newQuantity);
          // Giữ nguyên discount nếu có
          const finalPrice = item.discountType ? 
            POSCalculator.calculateDiscountedPrice(unitPrice, item.discountType, item.discountValue || 0) : 
            unitPrice;
          return { 
            ...item, 
            quantity: newQuantity, 
            unitPrice,
            originalPrice: unitPrice,
            finalPrice
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.finalPrice, 0);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getChangeAmount = () => {
    const received = parseFloat(receivedAmount) || 0;
    const total = getTotalAmount();
    return received - total;
  };  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Prepare transaction data
      const transactionData = {
        storeId: "store_001", // Có thể lấy từ context hoặc config
        items: cart.map(cartItem => ({
          id: cartItem.product.id,
          name: cartItem.product.name,
          price: cartItem.product.price,
          quantity: cartItem.quantity,
          total: cartItem.quantity * cartItem.product.price
        })),
        subtotal: getSubtotal(),
        discount: 0, // Có thể tính từ discount logic
        tax: 0, // Có thể tính thuế nếu cần
        total: getTotalAmount(),
        paymentMethod: paymentMethod,
        customerInfo: selectedCustomer ? {
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
          email: selectedCustomer.email
        } : undefined,
        cashierId: "cashier_001" // Có thể lấy từ auth context
      };

      // Save transaction (offline-first)
      await saveTransaction(transactionData);

      // Trừ kho thực tế cho tất cả sản phẩm trong giỏ
      cart.forEach(cartItem => {
        updateProductStock(cartItem.product.id, cartItem.quantity);
      });

      // Show success message
      const customerInfo = selectedCustomer ? ` cho ${selectedCustomer.name}` : "";
      const totalAmount = formatPrice(getTotalAmount());
      const itemCount = cart.length;
      const offlineNote = !isOnline ? " (Đã lưu offline - sẽ đồng bộ khi có mạng)" : "";
      
      alert(`✅ Đơn hàng${customerInfo} đã được xử lý thành công!${offlineNote}\n💰 Tổng tiền: ${totalAmount}\n📦 Số sản phẩm: ${itemCount}`);
      
      // Reset form
      setCart([]);
      setReceivedAmount("");
      setSelectedCustomer(null);
      setShowCart(false); // Hide cart on mobile after checkout
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra trong quá trình thanh toán');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Lấy icon theo loại sản phẩm
  const getSellTypeIcon = (sellType: string) => {
    switch (sellType) {
      case 'weight': return '⚖️';
      case 'volume': return '🥛';
      case 'piece': return '🔢';
      case 'bundle': return '🥬';
      case 'pack': return '📦';
      default: return '📦';
    }
  };

  // Lấy mô tả loại bán
  const getSellTypeLabel = (sellType: string) => {
    switch (sellType) {
      case 'weight': return 'Bán theo cân';
      case 'volume': return 'Bán theo thể tích';
      case 'piece': return 'Bán theo cái';
      case 'bundle': return 'Bán theo bó';
      case 'pack': return 'Bán theo gói';
      default: return 'Khác';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">      {/* Mobile Header - Sticky */}
      <div className="sticky top-0 z-40 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                🛒 POS Bán Hàng
              </h1>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Đa đơn vị tính
              </p>
            </div>
            
            {/* Mobile Connection Status */}
            <div className={`px-2 py-1 rounded-full text-xs ${
              isOnline 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
          </div>
          
          <Button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-blue-600 hover:bg-blue-700 h-10 px-3"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            <span className="text-sm">Giỏ ({cart.length})</span>
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center">
                {cart.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="lg:flex lg:h-screen">
        {/* Main Products Panel */}
        <div className={`flex-1 transition-all duration-300 ${showCart ? 'hidden lg:flex lg:flex-1' : 'flex flex-col'} overflow-hidden`}>          {/* Desktop Header */}
          <div className="hidden lg:block p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  POS - Bán Hàng
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Hệ thống bán hàng đa đơn vị tính
                </p>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  isOnline 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4" />
                      <span>Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4" />
                      <span>Offline</span>
                    </>
                  )}
                </div>
                
                {/* Sync Status */}
                {syncStatus !== 'idle' && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    syncStatus === 'syncing' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : syncStatus === 'success'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>                    {syncStatus === 'syncing' && (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Đang đồng bộ...</span>
                      </>
                    )}
                    {syncStatus === 'success' && (
                      <>
                        <RotateCw className="w-4 h-4" />
                        <span>Đã đồng bộ</span>
                      </>
                    )}
                    {syncStatus === 'error' && (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Lỗi đồng bộ</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 lg:px-6 pb-3 pt-3 lg:pt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-zinc-500" />
              <Input
                type="text"
                placeholder="🔍 Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm lg:text-lg py-3 lg:py-3 bg-white dark:bg-zinc-800"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="px-4 lg:px-6 pb-3">
            <div className="flex flex-wrap gap-1.5 lg:gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-xs lg:text-sm h-8 lg:h-9 px-2 lg:px-3 whitespace-nowrap ${
                    selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-1 text-xs h-4 px-1.5">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-20 lg:pb-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <Package className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-zinc-400 mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-sm lg:text-base text-zinc-600 dark:text-zinc-400 mb-3 lg:mb-4">
                  Thử thay đổi từ khóa tìm kiếm hoặc danh mục
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="p-3 lg:p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-zinc-200 dark:border-zinc-800 hover:border-blue-300 active:scale-95"
                    onClick={() => addToCart(product)}
                  >
                    <div className="text-center">
                      <div className="w-full h-20 sm:h-24 lg:h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-2 lg:mb-3">
                        <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-zinc-400" />
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm lg:text-sm mb-1 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs lg:text-xs text-zinc-500 dark:text-zinc-500 mb-1 lg:mb-2">
                        {product.sku}
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-green-600 dark:text-green-400 leading-tight">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-[9px] sm:text-xs lg:text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                        /{product.priceUnit}
                      </p>
                      <p className="text-[10px] sm:text-xs lg:text-xs text-zinc-500 mt-1">
                        Còn: {getAvailableStock(product.id)} {product.stockUnit}
                      </p>
                      <div className="mt-1 lg:mt-2 flex items-center justify-center gap-1">
                        <span className="text-xs">{getSellTypeIcon(product.sellType)}</span>
                        <span className="text-[9px] sm:text-[10px] lg:text-xs text-blue-600 dark:text-blue-400">
                          {getSellTypeLabel(product.sellType)}
                        </span>
                      </div>
                      {getAvailableStock(product.id) <= 0 && (
                        <p className="text-[10px] sm:text-xs lg:text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                          ❌ Hết hàng
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Cart Panel - Overlay */}
        <div className={`
          fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden
          ${showCart ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `} onClick={() => setShowCart(false)}>
          <div className={`
            absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-zinc-900 
            transform transition-transform duration-300 
            ${showCart ? 'translate-x-0' : 'translate-x-full'}
          `} onClick={(e) => e.stopPropagation()}>
            <div className="h-full flex flex-col">
              {/* Mobile Cart Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Giỏ hàng ({cart.length})
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowCart(false)}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Giỏ hàng trống</p>
                    <p className="text-xs">Chọn sản phẩm để bắt đầu</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <Card key={item.product.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                            {item.product.name}
                          </h4>
                          <div className="text-xs text-zinc-500 mt-1 space-y-1">
                            <p>
                              {item.quantity} {item.product.stockUnit}
                              {item.actualQuantity && item.actualQuantity !== item.quantity && (
                                <span className="text-orange-600 ml-1">
                                  (thực tế: {item.actualQuantity} {item.product.stockUnit.replace('vỉ', 'quả')})
                                </span>
                              )}
                              × {formatPrice(item.originalPrice / item.quantity)}
                            </p>
                            {item.discountType && (
                              <p className="text-red-600">
                                Giảm: {item.discountReason}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 h-auto text-red-600 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Actual Quantity & Discount Buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        {item.product.sellType === 'pack' && item.product.priceUnit.includes('(') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openActualQuantityModal(item)}
                            className="text-xs px-2 py-1 h-6"
                          >
                            📦 SL thực tế
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDiscountModal(item)}
                          className="text-xs px-2 py-1 h-6"
                        >
                          💰 Giảm giá
                        </Button>
                        {item.discountType && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDiscount(item.product.id)}
                            className="text-xs px-2 py-1 h-6 text-red-600"
                          >
                            ❌ Xóa giảm
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-10 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          {item.discountType && (
                            <p className="text-xs line-through text-zinc-500">
                              {formatPrice(item.originalPrice)}
                            </p>
                          )}
                          <p className="text-sm font-bold text-green-600 dark:text-green-400">
                            {formatPrice(item.finalPrice)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Mobile Checkout Section */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 space-y-3">
                  {/* Customer Selection */}
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomerSelector(true)}
                    className="w-full justify-start text-sm h-10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {selectedCustomer ? selectedCustomer.name : "Chọn khách hàng"}
                  </Button>

                  {/* Payment Method */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('cash')}
                      className="flex items-center justify-center text-sm h-10"
                    >
                      <Banknote className="w-4 h-4 mr-1" />
                      Tiền mặt
                    </Button>
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('card')}
                      className="flex items-center justify-center text-sm h-10"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Thẻ
                    </Button>
                  </div>

                  {/* Cash Payment Input */}
                  {paymentMethod === 'cash' && (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={receivedAmount}
                        onChange={(e) => setReceivedAmount(e.target.value)}
                        placeholder="Số tiền nhận..."
                        className="text-sm"
                      />
                      <QuickAmountButtons
                        totalAmount={getTotalAmount()}
                        onAmountSelect={(amount) => setReceivedAmount(amount.toString())}
                      />
                      {receivedAmount && (
                        <div className="flex justify-between text-sm">
                          <span>Tiền thừa:</span>
                          <span className={getChangeAmount() >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                            {formatPrice(getChangeAmount())}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(getTotalAmount())}</span>
                  </div>

                  {/* Checkout Button */}                  <Button
                    onClick={handleCheckout}
                    disabled={paymentMethod === 'cash' && getChangeAmount() < 0 || isProcessingPayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    {isProcessingPayment ? "Đang xử lý..." : "Thanh toán"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>        {/* Desktop Cart Panel */}
        <div className="hidden lg:flex w-96 xl:w-[420px] bg-zinc-50 dark:bg-zinc-900 flex-col border-l border-zinc-200 dark:border-zinc-800">
          {/* Cart Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Giỏ hàng
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {getTotalItems()} món
                </Badge>
                {cart.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Giỏ hàng trống</p>
                <p className="text-sm">Chọn sản phẩm để bắt đầu</p>
              </div>
            ) : (
              cart.map((item) => (
                <Card key={item.product.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-zinc-500 mt-1 space-y-1">
                        <p>
                          {item.quantity} {item.product.stockUnit}
                          {item.actualQuantity && item.actualQuantity !== item.quantity && (
                            <span className="text-orange-600 ml-1">
                              (thực tế: {item.actualQuantity} {item.product.stockUnit.replace('vỉ', 'quả')})
                            </span>
                          )}
                          × {formatPrice(item.originalPrice / item.quantity)}
                        </p>
                        {item.discountType && (
                          <p className="text-red-600">
                            Giảm: {item.discountReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 h-auto text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Desktop Actual Quantity & Discount Buttons */}
                  <div className="flex items-center gap-2 mt-2">
                    {item.product.sellType === 'pack' && item.product.priceUnit.includes('(') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openActualQuantityModal(item)}
                        className="text-xs px-2 py-1 h-7"
                      >
                        📦 Số lượng thực tế
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDiscountModal(item)}
                      className="text-xs px-2 py-1 h-7"
                    >
                      💰 Giảm giá
                    </Button>
                    {item.discountType && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDiscount(item.product.id)}
                        className="text-xs px-2 py-1 h-7 text-red-600"
                      >
                        ❌ Xóa giảm
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium w-12 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      {item.discountType && (
                        <p className="text-xs line-through text-zinc-500">
                          {formatPrice(item.originalPrice)}
                        </p>
                      )}
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatPrice(item.finalPrice)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              {/* Customer Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Khách hàng
                </label>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomerSelector(true)}
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  {selectedCustomer ? selectedCustomer.name : "Chọn khách hàng"}
                </Button>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('cash')}
                    className="flex items-center justify-center"
                  >
                    <Banknote className="w-4 h-4 mr-2" />
                    Tiền mặt
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className="flex items-center justify-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Thẻ
                  </Button>
                </div>
              </div>

              {/* Cash Payment Input */}
              {paymentMethod === 'cash' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Số tiền nhận
                    </label>
                    <Input
                      type="number"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      placeholder="Nhập số tiền khách đưa..."
                      className="mt-1"
                    />
                  </div>
                    <QuickAmountButtons
                    totalAmount={getTotalAmount()}
                    onAmountSelect={(amount) => setReceivedAmount(amount.toString())}
                  />

                  {receivedAmount && (
                    <div className="flex justify-between text-sm">
                      <span>Tiền thừa:</span>
                      <span className={getChangeAmount() >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {formatPrice(getChangeAmount())}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span>Tổng cộng:</span>
                <span>{formatPrice(getTotalAmount())}</span>
              </div>              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={paymentMethod === 'cash' && getChangeAmount() < 0 || isProcessingPayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Receipt className="w-4 h-4 mr-2" />
                {isProcessingPayment ? "Đang xử lý..." : "Thanh toán"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Customer Selector Modal */}
      {showCustomerSelector && (
        <CustomerSelector
          onSelect={setSelectedCustomer}
          onClose={() => setShowCustomerSelector(false)}
          selectedCustomer={selectedCustomer}
        />
      )}

      {/* Quantity Input Modal */}
      {quantityInputModal.show && quantityInputModal.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-800">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                Nhập số lượng - {quantityInputModal.product.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Số lượng ({quantityInputModal.product.stockUnit})
                  </label>
                  <Input
                    type="number"                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddWithQuantity();
                      } else if (e.key === 'Escape') {
                        closeQuantityModal();
                      }
                    }}
                    placeholder="Nhập số lượng..."
                    className="mt-1"
                    autoFocus
                    ref={quantityInputRef}
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Min: {quantityInputModal.product.minQuantity || 1} - 
                    Max: {quantityInputModal.product.maxQuantity || "Không giới hạn"}
                  </p>
                </div>

                {/* Quick Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {getQuickButtons(quantityInputModal.product).map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setQuantityInput(amount.toString())}
                      className="text-sm"
                    >
                      {amount} {quantityInputModal.product?.stockUnit}
                    </Button>
                  ))}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" onClick={closeQuantityModal} className="flex-1">
                    Hủy
                  </Button>
                  <Button onClick={handleAddWithQuantity} className="flex-1">
                    Thêm vào giỏ
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Actual Quantity Modal */}
      {actualQuantityModal.show && actualQuantityModal.cartItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-800">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                Số lượng thực tế bán
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                {actualQuantityModal.cartItem.product.name}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Số lượng thực tế (vd: vỉ trứng 10 quả nhưng chỉ bán 7 quả)
                  </label>
                  <Input
                    type="number"                    value={actualQuantityInput}
                    onChange={(e) => setActualQuantityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyActualQuantity();
                      } else if (e.key === 'Escape') {
                        closeActualQuantityModal();
                      }
                    }}                    placeholder="Nhập số lượng thực tế..."
                    className="mt-1"
                    autoFocus
                    ref={actualQuantityInputRef}
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Ví dụ: Vỉ trứng có 10 quả nhưng hư 3 quả → chỉ bán 7 quả
                  </p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" onClick={closeActualQuantityModal} className="flex-1">
                    Hủy
                  </Button>
                  <Button onClick={applyActualQuantity} className="flex-1">
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Discount Modal */}
      {discountModal.show && discountModal.cartItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-800">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                Giảm giá / Chiết khấu
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                {discountModal.cartItem.product.name}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Loại giảm giá
                  </label>
                  <select 
                    value={discountType} 
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'amount' | 'damage')}
                    className="w-full mt-1 p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700"
                  >
                    <option value="percentage">Giảm theo phần trăm (%)</option>
                    <option value="amount">Giảm theo số tiền (đ)</option>
                    <option value="damage">Hư hỏng (%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Giá trị giảm
                  </label>                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyDiscount();
                      } else if (e.key === 'Escape') {
                        closeDiscountModal();
                      }
                    }}
                    placeholder={discountType === 'amount' ? "Nhập số tiền..." : "Nhập phần trăm..."}
                    className="mt-1"
                    autoFocus
                    ref={discountValueInputRef}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Lý do (tùy chọn)
                  </label>
                  <Input
                    type="text"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    placeholder="Nhập lý do giảm giá..."
                    className="mt-1"
                  />
                </div>

                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  <p>Giá gốc: {formatPrice(discountModal.cartItem.originalPrice)}</p>
                  {discountValue && !isNaN(parseFloat(discountValue)) && (
                    <p>Giá sau giảm: {formatPrice(POSCalculator.calculateDiscountedPrice(discountModal.cartItem.originalPrice, discountType, parseFloat(discountValue)))}</p>
                  )}
                </div>                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" onClick={closeDiscountModal} className="flex-1" disabled={isApplyingDiscount}>
                    Hủy
                  </Button>
                  <Button onClick={applyDiscount} className="flex-1" disabled={isApplyingDiscount}>
                    {isApplyingDiscount ? "Đang xử lý..." : "Áp dụng giảm giá"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}      {/* Customer Selector Modal */}
      {showCustomerSelector && (
        <CustomerSelector
          onSelect={setSelectedCustomer}
          onClose={() => setShowCustomerSelector(false)}
          selectedCustomer={selectedCustomer}
        />
      )}
    </div>
  );
}
