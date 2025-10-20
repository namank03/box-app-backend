const Order = require('../models/Order');
const Client = require('../models/Client');
const Material = require('../models/Material');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Shipment = require('../models/Shipment');

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    // Use MongoDB aggregation for efficient data retrieval
    const [
      orderStats,
      clientStats,
      materialStats,
      paymentStats,
      recentOrders,
      recentPayments,
      lowStockItems,
      monthlyRevenue
    ] = await Promise.all([
      // Order statistics
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['New', 'Confirmed', 'In Production', 'Packed', 'Partially Shipped']] },
                  1,
                  0
                ]
              }
            },
            completedOrders: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
              }
            }
          }
        }
      ]),

      // Client statistics
      Client.aggregate([
        {
          $group: {
            _id: null,
            totalClients: { $sum: 1 },
            activeClients: {
              $sum: {
                $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
              }
            }
          }
        }
      ]),

      // Material statistics
      Material.aggregate([
        {
          $group: {
            _id: null,
            totalMaterials: { $sum: 1 },
            lowStockMaterials: {
              $sum: {
                $cond: [
                  { $lte: ['$currentStock', '$lowStockThreshold'] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]),

      // Payment statistics
      Payment.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            pendingPayments: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
              }
            }
          }
        }
      ]),

      // Recent orders (last 5)
      Order.find()
        .populate('clientId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Recent payments (last 5)
      Payment.find()
        .populate('clientId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Low stock items
      Material.find({
        $expr: { $lte: ['$currentStock', '$lowStockThreshold'] }
      })
        .select('name currentStock lowStockThreshold unit')
        .lean(),

      // Monthly revenue for charts (last 6 months)
      Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$orderDate' },
              month: { $month: '$orderDate' }
            },
            revenue: { $sum: '$totalAmount' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ])
    ]);

    // Extract statistics from aggregation results
    const orderStatsData = orderStats[0] || { totalOrders: 0, pendingOrders: 0, completedOrders: 0 };
    const clientStatsData = clientStats[0] || { totalClients: 0, activeClients: 0 };
    const materialStatsData = materialStats[0] || { totalMaterials: 0, lowStockMaterials: 0 };
    const paymentStatsData = paymentStats[0] || { totalRevenue: 0, pendingPayments: 0 };

    // Format recent orders with client names
    const formattedRecentOrders = recentOrders.map(order => ({
      ...order,
      clientName: order.clientId ? order.clientId.name : 'Unknown Client'
    }));

    // Format recent payments with client names
    const formattedRecentPayments = recentPayments.map(payment => ({
      ...payment,
      clientName: payment.clientId ? payment.clientId.name : 'Unknown Client'
    }));

    // Format monthly revenue for charts
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
      revenue: item.revenue
    }));

    const stats = {
      totalOrders: orderStatsData.totalOrders,
      pendingOrders: orderStatsData.pendingOrders,
      completedOrders: orderStatsData.completedOrders,
      totalClients: clientStatsData.totalClients,
      activeClients: clientStatsData.activeClients,
      totalMaterials: materialStatsData.totalMaterials,
      lowStockMaterials: materialStatsData.lowStockMaterials,
      totalRevenue: paymentStatsData.totalRevenue,
      pendingPayments: paymentStatsData.pendingPayments,
      recentOrders: formattedRecentOrders,
      recentPayments: formattedRecentPayments,
      lowStockItems,
      monthlyRevenue: formattedMonthlyRevenue
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Keep the old method for backward compatibility
exports.getDashboardStats = exports.getStats;
