"use client";

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartDataPoint {
  [key: string]: string | number;
}

interface SalesChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'area' | 'bar';
  height?: number;
}

export function SalesChart({ data, type, height = 300 }: SalesChartProps) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(value);
  };
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string;
}

interface PayloadEntry {
  color: string;
  name: string;
  value: number;
}

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: PayloadEntry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  switch (type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={colors[1]} 
              fill={colors[1]} 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill={colors[2]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
}

// Pie Chart Component
interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface CustomPieChartProps {
  data: PieChartData[];
  height?: number;
}

export function CustomPieChart({ data, height = 300 }: CustomPieChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(value);
  };

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Multi-line Chart Component
interface MultiLineChartProps {
  data: ChartDataPoint[];
  lines: { key: string; name: string; color: string }[];
  height?: number;
}

export function MultiLineChart({ data, lines, height = 300 }: MultiLineChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            name={line.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// Horizontal Bar Chart Component
interface HorizontalBarChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export function HorizontalBarChart({ data, height = 300 }: HorizontalBarChartProps) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="horizontal"
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="value" fill={colors[0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
