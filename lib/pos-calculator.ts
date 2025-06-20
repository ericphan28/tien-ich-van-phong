// Constants for POS system
export const POS_CONSTANTS = {
  // Discount limits
  MAX_DISCOUNT_PERCENTAGE: 100,
  MIN_DISCOUNT_PERCENTAGE: 0,
  
  // Quantity limits
  MIN_QUANTITY: 0,
  MAX_QUANTITY: 99999,
  
  // Price limits
  MIN_PRICE: 0,
  MAX_PRICE: 999999999,
  
  // Decimal places for calculations
  CURRENCY_DECIMAL_PLACES: 0, // VND doesn't use decimals
  WEIGHT_DECIMAL_PLACES: 3,   // For gram calculations
  
  // UI Constants
  QUICK_WEIGHT_AMOUNTS: [100, 200, 500, 1000, 1500, 2000], // grams
  QUICK_VOLUME_AMOUNTS: [250, 500, 750, 1000, 1500, 2000], // ml
  QUICK_PIECE_AMOUNTS: [1, 2, 3, 5, 10],
  
  // Error messages
  ERRORS: {
    INVALID_QUANTITY: "Vui lòng nhập số lượng hợp lệ",
    QUANTITY_TOO_LOW: "Số lượng quá thấp",
    QUANTITY_TOO_HIGH: "Số lượng quá cao", 
    INSUFFICIENT_STOCK: "Không đủ hàng trong kho",
    INVALID_DISCOUNT: "Vui lòng nhập giá trị giảm giá hợp lệ",
    DISCOUNT_TOO_HIGH: "Giá trị giảm giá quá cao",
    INVALID_ACTUAL_QUANTITY: "Số lượng thực tế không hợp lệ"
  }
} as const;

// Discount types
export type DiscountType = 'percentage' | 'amount' | 'damage';

// Product sell types  
export type SellType = 'weight' | 'volume' | 'piece' | 'bundle' | 'pack';

// Helper functions for calculations
export class POSCalculator {
  
  /**
   * Format price to Vietnamese currency
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Math.round(price));
  }

  /**
   * Round to VND (no decimals)
   */
  static roundToVND(amount: number): number {
    return Math.round(amount);
  }

  /**
   * Calculate discounted price
   */
  static calculateDiscountedPrice(
    originalPrice: number, 
    discountType: DiscountType, 
    discountValue: number
  ): number {
    let discountedPrice: number;
    
    switch (discountType) {
      case 'percentage':
      case 'damage':
        discountedPrice = originalPrice * (1 - discountValue / 100);
        break;
      case 'amount':
        discountedPrice = originalPrice - discountValue;
        break;
      default:
        discountedPrice = originalPrice;
    }
    
    // Ensure price doesn't go below 0
    return Math.max(0, this.roundToVND(discountedPrice));
  }

  /**
   * Calculate actual quantity price (for packs like egg cartons)
   */
  static calculateActualQuantityPrice(
    originalPrice: number,
    totalUnits: number, 
    actualUnits: number
  ): number {
    if (totalUnits <= 0 || actualUnits < 0) return 0;
    
    const pricePerUnit = originalPrice / totalUnits;
    return this.roundToVND(pricePerUnit * actualUnits);
  }

  /**
   * Validate discount value
   */
  static validateDiscount(
    discountType: DiscountType, 
    discountValue: number, 
    originalPrice: number
  ): string | null {
    if (isNaN(discountValue) || discountValue < 0) {
      return POS_CONSTANTS.ERRORS.INVALID_DISCOUNT;
    }

    if (discountType === 'percentage' || discountType === 'damage') {
      if (discountValue > POS_CONSTANTS.MAX_DISCOUNT_PERCENTAGE) {
        return POS_CONSTANTS.ERRORS.DISCOUNT_TOO_HIGH;
      }
    }

    if (discountType === 'amount') {
      if (discountValue > originalPrice) {
        return POS_CONSTANTS.ERRORS.DISCOUNT_TOO_HIGH;
      }
    }

    return null; // Valid
  }

  /**
   * Validate quantity input
   */
  static validateQuantity(
    quantity: number,
    minQuantity?: number,
    maxQuantity?: number,
    availableStock?: number
  ): string | null {
    if (isNaN(quantity) || quantity <= 0) {
      return POS_CONSTANTS.ERRORS.INVALID_QUANTITY;
    }

    if (minQuantity && quantity < minQuantity) {
      return `${POS_CONSTANTS.ERRORS.QUANTITY_TOO_LOW}. Tối thiểu: ${minQuantity}`;
    }

    if (maxQuantity && quantity > maxQuantity) {
      return `${POS_CONSTANTS.ERRORS.QUANTITY_TOO_HIGH}. Tối đa: ${maxQuantity}`;
    }

    if (availableStock !== undefined && quantity > availableStock) {
      return `${POS_CONSTANTS.ERRORS.INSUFFICIENT_STOCK}. Còn lại: ${availableStock}`;
    }

    return null; // Valid
  }
  /**
   * Get quick amount buttons based on sell type
   */
  static getQuickAmounts(sellType: SellType): readonly number[] {
    switch (sellType) {
      case 'weight':
        return POS_CONSTANTS.QUICK_WEIGHT_AMOUNTS;
      case 'volume':
        return POS_CONSTANTS.QUICK_VOLUME_AMOUNTS;
      case 'piece':
      case 'bundle':
      case 'pack':
        return POS_CONSTANTS.QUICK_PIECE_AMOUNTS;
      default:
        return POS_CONSTANTS.QUICK_PIECE_AMOUNTS;
    }
  }

  /**
   * Calculate price based on product type and quantity
   */
  static calculateProductPrice(
    product: { price: number; priceUnit: string; sellType: SellType },
    quantity: number
  ): number {
    switch (product.sellType) {
      case 'weight':
        // Price per kg, calculate for grams
        return this.roundToVND((product.price * quantity) / 1000);
        
      case 'volume':
        // Calculate price per ml
        const pricePerMl = product.priceUnit.includes('lít') 
          ? product.price / 1000 
          : product.price / parseInt(product.priceUnit.match(/\d+/)?.[0] || "1");
        return this.roundToVND(pricePerMl * quantity);
        
      default:
        // Price per piece/bundle/pack
        return this.roundToVND(product.price * quantity);
    }
  }

  /**
   * Extract units from price unit string (e.g., "1 vỉ (10 quả)" -> 10)
   */
  static extractUnitsFromPriceUnit(priceUnit: string): number {
    const match = priceUnit.match(/\((\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  /**
   * Generate default discount reason
   */
  static getDefaultDiscountReason(type: DiscountType, value: number): string {
    switch (type) {
      case 'percentage':
        return `Giảm giá ${value}%`;
      case 'amount':
        return `Giảm ${this.formatPrice(value)}`;
      case 'damage':
        return `Hư hỏng ${value}%`;
      default:
        return 'Giảm giá';
    }
  }
}
