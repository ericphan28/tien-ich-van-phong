"use client";

import React, { useState, useMemo } from 'react';
import { Search, Plus, Grid, List, Edit, Trash2, Eye, Package, Tag, DollarSign, Image, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Types
interface ProductCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  barcode: string;
  images: string[];
  status: 'active' | 'inactive' | 'discontinued';
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockCategories: ProductCategory[] = [
  { id: '1', name: 'Rau hữu cơ', description: 'Rau xanh hữu cơ tươi ngon', color: 'bg-green-100 text-green-800' },
  { id: '2', name: 'Hải sản tươi', description: 'Hải sản tươi sống cao cấp', color: 'bg-blue-100 text-blue-800' },
  { id: '3', name: 'Thịt đông lạnh', description: 'Thịt đông lạnh nhập khẩu', color: 'bg-red-100 text-red-800' },
  { id: '4', name: 'Trái cây nhập khẩu', description: 'Trái cây tươi nhập khẩu', color: 'bg-orange-100 text-orange-800' },
  { id: '5', name: 'Sản phẩm organic', description: 'Thực phẩm hữu cơ cao cấp', color: 'bg-emerald-100 text-emerald-800' },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cá hồi Na Uy fillet',
    sku: 'FISH001',
    description: 'Cá hồi Na Uy tươi ngon, thích hợp cho sashimi',
    category: '2',
    price: 350000,
    costPrice: 280000,
    stock: 2500,
    lowStockThreshold: 500,
    unit: 'gram',
    barcode: '8934563001234',
    images: ['/images/ca-hoi.jpg'],
    status: 'active',
    weight: 2500,
    tags: ['tươi sống', 'nhập khẩu', 'cao cấp'],
    createdAt: '2024-01-15',
    updatedAt: '2024-06-19'
  },
  {
    id: '2',
    name: 'Rau cải bó xôi hữu cơ',
    sku: 'VEG001',
    description: 'Rau cải bó xôi hữu cơ tươi xanh, không thuốc trừ sâu',
    category: '1',
    price: 45000,
    costPrice: 35000,
    stock: 50,
    lowStockThreshold: 10,
    unit: 'bó',
    barcode: '8934563001235',
    images: ['/images/cai-bo-xoi.jpg'],
    status: 'active',
    tags: ['hữu cơ', 'việt nam', 'tươi'],
    createdAt: '2024-01-20',
    updatedAt: '2024-06-19'
  },
  {
    id: '3',
    name: 'Thịt bò Wagyu A5',
    sku: 'MEAT001',
    description: 'Thịt bò Wagyu A5 Nhật Bản, chất lượng cao cấp',
    category: '3',
    price: 1200000,
    costPrice: 950000,
    stock: 1500,
    lowStockThreshold: 300,
    unit: 'gram',
    barcode: '8934563001236',
    images: ['/images/wagyu.jpg'],
    status: 'active',
    weight: 1500,
    tags: ['wagyu', 'nhật bản', 'cao cấp'],
    createdAt: '2024-01-25',
    updatedAt: '2024-06-19'
  },
  {
    id: '4',
    name: 'Nho đỏ Mỹ',
    sku: 'FRUIT001',
    description: 'Nho đỏ nhập khẩu từ Mỹ, ngọt và tươi',
    category: '4',
    price: 180000,
    costPrice: 140000,
    stock: 5000,
    lowStockThreshold: 1000,
    unit: 'gram',
    barcode: '8934563001237',
    images: ['/images/nho-do.jpg'],
    status: 'active',
    weight: 5000,
    tags: ['nhập khẩu', 'tươi', 'mỹ'],
    createdAt: '2024-02-01',
    updatedAt: '2024-06-19'
  },
  {
    id: '5',
    name: 'Sữa hạnh nhân organic',
    sku: 'ORG001',
    description: 'Sữa hạnh nhân hữu cơ không đường, giàu dinh dưỡng',
    category: '5',
    price: 95000,
    costPrice: 75000,
    stock: 24,
    lowStockThreshold: 5,
    unit: 'hộp',
    barcode: '8934563001238',
    images: ['/images/sua-hanh-nhan.jpg'],
    status: 'active',
    tags: ['organic', 'không đường', 'dinh dưỡng'],
    createdAt: '2024-02-05',
    updatedAt: '2024-06-19'
  }
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Get category name
  const getCategoryName = (categoryId: string) => {
    return mockCategories.find(cat => cat.id === categoryId)?.name || 'Chưa phân loại';
  };

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    return mockCategories.find(cat => cat.id === categoryId)?.color || 'bg-gray-100 text-gray-800';
  };

  // Get stock status
  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: 'Hết hàng', color: 'bg-red-100 text-red-800' };
    if (product.stock <= product.lowStockThreshold) return { label: 'Sắp hết', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Còn hàng', color: 'bg-green-100 text-green-800' };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">Quản lý toàn bộ sản phẩm trong cửa hàng</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">{mockProducts.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sản phẩm active</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockProducts.filter(p => p.status === 'active').length}
                </p>
              </div>
              <Tag className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sắp hết hàng</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockProducts.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng giá trị</p>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(mockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {mockCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Tạm dừng</option>
              <option value="discontinued">Ngừng bán</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const stockStatus = getStockStatus(product);
            const categoryColor = getCategoryColor(product.category);
            
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {/* Product Image */}                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="w-12 h-12 text-gray-400" />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                      <div className="relative">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge className={categoryColor}>
                        {getCategoryName(product.category)}
                      </Badge>
                      <Badge className={stockStatus.color}>
                        {stockStatus.label}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tồn kho: {product.stock} {product.unit}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Xem
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-900">Sản phẩm</th>
                    <th className="text-left p-4 font-semibold text-gray-900">SKU</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Danh mục</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Giá bán</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Tồn kho</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Trạng thái</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product);
                    const categoryColor = getCategoryColor(product.category);
                    
                    return (
                      <tr key={product.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {/* eslint-disable-next-line jsx-a11y/alt-text */}
                              <Image className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm">{product.sku}</td>
                        <td className="p-4">
                          <Badge className={categoryColor}>
                            {getCategoryName(product.category)}
                          </Badge>
                        </td>
                        <td className="p-4 font-semibold">{formatCurrency(product.price)}</td>
                        <td className="p-4">{product.stock} {product.unit}</td>
                        <td className="p-4">
                          <Badge className={stockStatus.color}>
                            {stockStatus.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Thêm sản phẩm mới</h2>
              <p className="text-gray-600 mb-4">Form thêm sản phẩm sẽ được implement ở đây</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Hủy
                </Button>
                <Button>
                  Lưu sản phẩm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}