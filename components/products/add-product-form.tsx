"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Package,
  DollarSign,
  Archive,
  Tag
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image: string | null;
  status: string;
  createdAt: string;
}

interface AddProductFormProps {
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function AddProductForm({ onClose, onSave }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null as File | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const categories = [
    "Rau hữu cơ",
    "Rau nhập khẩu", 
    "Hải sản tươi",
    "Hải sản đông lạnh",
    "Thịt đông lạnh",
    "Sashimi tươi",
    "Trái cây nhập khẩu",
    "Gia vị cao cấp",
    "Đồ khô",
    "Khác"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
        const newProduct = {
        ...formData,
        id: Date.now().toString(),
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        status: parseInt(formData.stock) > 10 ? "active" : 
               parseInt(formData.stock) > 0 ? "low_stock" : "out_of_stock",
        createdAt: new Date().toISOString().split('T')[0],
        image: imagePreview // Use preview string instead of File
      };

      onSave(newProduct);
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Thêm Sản Phẩm Mới
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Nhập thông tin chi tiết về sản phẩm
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Hình ảnh sản phẩm
            </Label>
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
              {imagePreview ? (
                <div className="relative aspect-square max-w-xs mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <ImageIcon className="w-12 h-12 text-zinc-400 mb-4" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    Kéo thả hoặc click để chọn ảnh
                  </p>
                  <p className="text-xs text-zinc-500">
                    PNG, JPG, WEBP (tối đa 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Tên sản phẩm *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="VD: iPhone 15 Pro"
                required
                className="border-zinc-300 dark:border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Mã SKU *
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="VD: IP15PRO128"
                required
                className="border-zinc-300 dark:border-zinc-700"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Danh mục *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={formData.category === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange("category", category)}
                  className={formData.category === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Giá bán (VND) *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0"
                  required
                  className="pl-10 border-zinc-300 dark:border-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Số lượng tồn kho *
              </Label>
              <div className="relative">
                <Archive className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                  required
                  className="pl-10 border-zinc-300 dark:border-zinc-700"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Mô tả sản phẩm
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hủy bỏ
            </Button>
            <Button 
              type="submit"
              disabled={loading || !formData.name || !formData.sku || !formData.category || !formData.price || !formData.stock}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? "Đang lưu..." : "Lưu sản phẩm"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
