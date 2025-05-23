import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// Book Copy Status Constants
const BOOK_COPY_STATUS = {
  PENDING: 'pending',
  OPENING: 'opening',
  LOST: 'lost',
  RETIRED: 'retired'
};

// Order Status Constants
const ORDER_STATUS = {
  CLOSE: 'closed',
  REJECT: 'rejected',
  LOST: 'lost',
};

const ORDER_RENEWS_STATUS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

// Notification Type Constants
const NOTIFICATION_TYPES = {
  NEW_ORDER: 'new_order',
  ORDER_APPROVED: 'order_approved',
  ORDER_REJECTED: 'order_rejected',
  ORDER_CLOSED: 'order_closed',
  ORDER_LOST: 'order_lost',
  REQUEST_EXTEND_DUE_DATE: 'request_extend_due_date',
  APPROVED_EXTEND_DUE_DATE: 'approved_extend_due_date',
  STAFF_EXTEND_DUE_DATE: 'staff_extend_due_date',
  REJECTED_REQUEST_DUE_DATE: 'rejected_request_due_date'
};

const NOTIFICATION_MESSAGES = {
  NEW_ORDER: 'You have a new order. Please check it!',
  ORDER_REJECTED: 'Your order #{orderId} was rejected. Please check it!',
  ORDER_APPROVED: 'Your order #{orderId} was approved. Please check it!',
  ORDER_CLOSED: 'Your order #{orderId} was closed. Please check it!',
  ORDER_LOST: 'The book in order #{orderId} was lost and the order was closed.',
  REQUEST_EXTEND_DUE_DATE: 'A request is to extend due date. Please check it!',
  APPROVED_EXTEND_DUE_DATE: 'Your request of extending due date was approved',
  STAFF_EXTEND_DUE_DATE: 'Your order #{orderId} was extened.',
  REJECTED_REQUEST_DUE_DATE: 'Your request of extending due date was rejected.'
}

// User Role Constants
const USER_ROLE_READER = 'reader';
const USER_ROLE_STAFF = 'staff';

// Timeline Type Constants
const TIMELINE_TYPES = {
  ORDER_CREATED: 'order_created',
  ORDER_APPROVED: 'order_approved',
  ORDER_REJECTED: 'order_rejected',
  ORDER_CLOSED: 'order_closed',
  ORDER_LOST: 'order_lost',
  ORDER_REQUEST_DUE_DATE: 'order_request_due_date',
  ORDER_REQUEST_REJECTED: 'order_request_rejected',
  ORDER_REQUEST_APPROVED: 'order_request_approved',
};

console.log("Seeding database...");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const shouldTruncate = process.argv.includes('--truncate');

const tables = [
  'orders',
  'order_timeline',
  'notifications',
];

if (shouldTruncate) {
  await truncateAllTables(tables);
}
seedDatabase();

async function truncateAllTables(tables) {
  console.log("Truncating all tables...");
  
  try {
    const sqlStatement = `TRUNCATE TABLE ${tables.join(', ')} CASCADE;`;
    const { error } = await supabase.rpc('execute_sql', { sql: sqlStatement });
    if (error) throw error;

    console.log("All tables truncated successfully");
  } catch (err) {
    console.error("Failed to truncate tables:", err);
  }
}

async function seedDatabase() {
  console.log("Seeding database...");
  
  try {
    // get all readers
    const { data:allReaders } = await supabase
      .from("users")
      .select("id")
      .eq("role", USER_ROLE_READER);

    // get all staff
    const { data:allStaff } = await supabase
      .from("users")
      .select("id")
      .eq("role", USER_ROLE_STAFF);

    const readerIds = allReaders.map(reader => reader.id);
    const staffIds = allStaff.map(staff => staff.id);

    console.log("Seeding orders...");
    const orderFlows = [
      {
        status: ORDER_STATUS.CLOSE,
        reader_id: '#readerId#',
        book_id: '#bookId#',
        book_copy_id: '#bookCopyId#',
        created_at: 'past_date',
        due_date: 'created_at + 7 days',
        returned_at: 'is gte due_date',
        notifications: [
          {
            type: NOTIFICATION_TYPES.NEW_ORDER,
            message: NOTIFICATION_MESSAGES.NEW_ORDER,
            user_id: null,
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_APPROVED,
            message: NOTIFICATION_MESSAGES.ORDER_APPROVED,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_CLOSED,
            message: NOTIFICATION_MESSAGES.ORDER_CLOSED,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of returned_at'
          },
        ],
        order_timeline: [
          {
            action: TIMELINE_TYPES.ORDER_CREATED,
            user_id: '#readerId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_APPROVED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_CLOSED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of returned_at'
          },
        ]
      },
      {
        status: ORDER_STATUS.REJECT,
        reader_id: '#readerId#',
        book_id: '#bookId#',
        book_copy_id: '#bookCopyId#',
        created_at: 'past_date',
        due_date: 'created_at + 7 days',
        returned_at: 'is gte due_date',
        notifications: [
          {
            type: NOTIFICATION_TYPES.NEW_ORDER,
            message: NOTIFICATION_MESSAGES.NEW_ORDER,
            user_id: null,
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_REJECTED,
            message: NOTIFICATION_MESSAGES.ORDER_REJECTED,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
        ],
        order_timeline: [
          {
            action: TIMELINE_TYPES.ORDER_CREATED,
            user_id: '#readerId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_REJECTED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
        ]
      },
      {
        status: ORDER_STATUS.LOST,
        reader_id: '#readerId#',
        book_id: '#bookId#',
        book_copy_id: '#bookCopyId#',
        created_at: 'past_date',
        due_date: 'created_at + 7 days',
        returned_at: null,
        notifications: [
          {
            type: NOTIFICATION_TYPES.NEW_ORDER,
            message: NOTIFICATION_MESSAGES.NEW_ORDER,
            user_id: null,
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_APPROVED,
            message: NOTIFICATION_MESSAGES.ORDER_APPROVED,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_LOST,
            message: NOTIFICATION_MESSAGES.ORDER_LOST,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order returned_at'
          },
        ],
        order_timeline: [
          {
            action: TIMELINE_TYPES.ORDER_CREATED,
            user_id: '#readerId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_APPROVED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_CLOSED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of returned_at'
          },
        ]
      },
      {
        status: ORDER_STATUS.CLOSE,
        reader_id: '#readerId#',
        book_id: '#bookId#',
        book_copy_id: '#bookCopyId#',
        created_at: 'past_date',
        due_date: 'created_at + 14 days',
        returned_at: 'is gte due_date',
        order_renews: {
          order_id: '#orderId#',
          new_due_date: 'is same date of order due_date',
          old_due_date: 'created_at + 7 days',
          status: ORDER_RENEWS_STATUS.APPROVED,
        },
        notifications: [
          {
            type: NOTIFICATION_TYPES.NEW_ORDER,
            message: NOTIFICATION_MESSAGES.NEW_ORDER,
            user_id: null,
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_APPROVED,
            message: NOTIFICATION_MESSAGES.ORDER_APPROVED,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.REQUEST_EXTEND_DUE_DATE,
            message: NOTIFICATION_MESSAGES.REQUEST_EXTEND_DUE_DATE,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'created_at + 7 days'
          },
          {
            type: NOTIFICATION_TYPES.APPROVED_EXTEND_DUE_DATE,
            message: NOTIFICATION_MESSAGES.APPROVED_EXTEND_DUE_DATE,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'created_at + 7 days'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_CLOSED,
            message: NOTIFICATION_MESSAGES.ORDER_CLOSED,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of returned_at'
          },
        ],
        order_timeline: [
          {
            action: TIMELINE_TYPES.ORDER_CREATED,
            user_id: '#readerId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_APPROVED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_REQUEST_DUE_DATE,
            user_id: '#readerId#',
            order_id: '#orderId#',
            created_at: 'created_at + 7 days'
          },
          {
            action: TIMELINE_TYPES.ORDER_REQUEST_APPROVED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'created_at + 7 days'
          },
          {
            action: TIMELINE_TYPES.ORDER_CLOSED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of returned_at'
          },
        ]
      },
            {
        status: ORDER_STATUS.CLOSE,
        reader_id: '#readerId#',
        book_id: '#bookId#',
        book_copy_id: '#bookCopyId#',
        created_at: 'past_date',
        due_date: 'created_at + 14 days',
        returned_at: 'is gte due_date',
        order_renews: {
          order_id: '#orderId#',
          new_due_date: 'is same date of order due_date',
          old_due_date: 'created_at + 7 days',
          status: ORDER_RENEWS_STATUS.REJECTED,
        },
        notifications: [
          {
            type: NOTIFICATION_TYPES.NEW_ORDER,
            message: NOTIFICATION_MESSAGES.NEW_ORDER,
            user_id: null,
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_APPROVED,
            message: NOTIFICATION_MESSAGES.ORDER_APPROVED,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
          {
            type: NOTIFICATION_TYPES.REQUEST_EXTEND_DUE_DATE,
            message: NOTIFICATION_MESSAGES.REQUEST_EXTEND_DUE_DATE,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'created_at + 7 days'
          },
          {
            type: NOTIFICATION_TYPES.REJECTED_REQUEST_DUE_DATE,
            message: NOTIFICATION_MESSAGES.REJECTED_REQUEST_DUE_DATE,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'created_at + 7 days'
          },
          {
            type: NOTIFICATION_TYPES.ORDER_CLOSED,
            message: NOTIFICATION_MESSAGES.ORDER_CLOSED,
            user_id: '#readerId#',
            is_read: true,
            notifiable_id: '#orderId#',
            notifiable_type: 'orders',
            created_at: 'is same date of returned_at'
          },
        ],
        order_timeline: [
          {
            action: TIMELINE_TYPES.ORDER_CREATED,
            user_id: '#readerId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_APPROVED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of order created_at or next day of order created_at'
          },
          {
            action: TIMELINE_TYPES.ORDER_REQUEST_DUE_DATE,
            user_id: '#readerId#',
            order_id: '#orderId#',
            created_at: 'created_at + 7 days'
          },
          {
            action: TIMELINE_TYPES.ORDER_REQUEST_REJECTED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'created_at + 7 days'
          },
          {
            action: TIMELINE_TYPES.ORDER_CLOSED,
            user_id: '#staffId#',
            order_id: '#orderId#',
            created_at: 'is same date of returned_at'
          },
        ]
      },
    ];

    const mockOrders = [];
    const mockNotifications = [];
    const mockOrderTimeline = [];
    const mockOrderRenews = [];

    const { data: openingBookCopies } = await supabase
      .from("book_copies")
      .select("id, book_id, status")
      .in("status", [BOOK_COPY_STATUS.OPENING]);

    const { data: lostCopies } = await supabase
      .from("book_copies")
      .select("id, book_id")
      .eq("status", BOOK_COPY_STATUS.LOST);

    const lostBookCopies = lostCopies || [];

    const orderTypesToGenerate = {
      [ORDER_STATUS.CLOSE]: 500,
      [ORDER_STATUS.REJECT]: 50,
      [ORDER_STATUS.LOST]: 20,
    };

    let nextOrderId = 1;

    for (const flow of orderFlows) {
      const quantityToGenerate = orderTypesToGenerate[flow.status] || 50;
      
      for (let i = 0; i < quantityToGenerate; i++) {
        const readerId = faker.helpers.arrayElement(readerIds);
        const staffId = faker.helpers.arrayElement(staffIds);
        
        let bookId, bookCopyId;
        
        if (flow.status === ORDER_STATUS.LOST && lostBookCopies.length > 0) {
          const randomLostCopy = faker.helpers.arrayElement(lostBookCopies);
          bookId = randomLostCopy.book_id;
          bookCopyId = randomLostCopy.id;
        } else {
          const randomBookCopy = faker.helpers.arrayElement(openingBookCopies);
          bookId = randomBookCopy.book_id;
          bookCopyId = randomBookCopy.id;
        }

        const pastDate = faker.date.past({ years: 1 });
        const created_at = pastDate.toISOString();
        const createdDate = new Date(created_at);
        
        const dueDate = new Date(createdDate);
        dueDate.setDate(createdDate.getDate() + 7);
        const due_date = dueDate.toISOString();
        
        const returnedDate = new Date(dueDate);
        returnedDate.setDate(dueDate.getDate() + faker.number.int({ min: 0, max: 5 }));
        const returned_at = returnedDate.toISOString();
        
        const orderId = nextOrderId++;
        
        // Create order
        const order = {
          id: orderId,
          status: flow.status,
          reader_id: readerId,
          book_id: bookId,
          book_copy_id: bookCopyId,
          created_at,
          due_date,
          returned_at: flow.status === ORDER_STATUS.LOST ? null : 
                       flow.status !== ORDER_STATUS.REJECT ? returned_at : null,
        };
        mockOrders.push(order);
        
        // Process notifications
        for (const notificationTemplate of flow.notifications) {
          const notification = {
            ...notificationTemplate,
            user_id: notificationTemplate.user_id === '#readerId#' ? readerId : notificationTemplate.user_id,
            notifiable_id: notificationTemplate.notifiable_id === '#orderId#' ? orderId : notificationTemplate.notifiable_id,
          };
          
          let notificationDate;
          if (notification.created_at === 'is same date of order created_at') {
            notificationDate = new Date(pastDate);
          } else if (notification.created_at === 'is same date of order created_at or next day of order created_at') {
            notificationDate = new Date(pastDate);
            if (faker.datatype.boolean()) {
              notificationDate.setDate(notificationDate.getDate() + 1);
            }
          } else if (notification.created_at === 'is same date of returned_at' || 
                    notification.created_at === 'is same date of order returned_at') {
            if (flow.status === ORDER_STATUS.LOST) {
              // For LOST orders, use a date after due_date for the notification
              notificationDate = new Date(dueDate);
              notificationDate.setDate(dueDate.getDate() + faker.number.int({ min: 1, max: 10 }));
            } else if (flow.status !== ORDER_STATUS.REJECT) {
              notificationDate = new Date(returned_at);
            } else {
              notificationDate = new Date(pastDate);
            }
          } else if (notification.created_at === 'created_at + 7 days') {
            notificationDate = new Date(pastDate);
            notificationDate.setDate(pastDate.getDate() + 7);
          } else {
            notificationDate = new Date(pastDate);
          }
          
          notification.created_at = notificationDate.toISOString();
          mockNotifications.push(notification);
        }
        
        // Process timelines
        for (const timelineTemplate of flow.order_timeline) {
          const timeline = {
            ...timelineTemplate,
            user_id: timelineTemplate.user_id === '#readerId#' ? readerId : 
                     timelineTemplate.user_id === '#staffId#' ? staffId : timelineTemplate.user_id,
            order_id: timelineTemplate.order_id === '#orderId#' ? orderId : timelineTemplate.order_id,
          };
          
          let timelineDate;
          if (timeline.created_at === 'is same date of order created_at') {
            timelineDate = new Date(pastDate);
          } else if (timeline.created_at === 'is same date of order created_at or next day of order created_at') {
            timelineDate = new Date(pastDate);
            if (faker.datatype.boolean()) {
              timelineDate.setDate(timelineDate.getDate() + 1);
            }
          } else if (timeline.created_at === 'is same date of returned_at') {
            if (flow.status === ORDER_STATUS.LOST) {
              // For LOST orders, use a date after due_date for the CLOSED/LOST action
              timelineDate = new Date(dueDate);
              timelineDate.setDate(dueDate.getDate() + faker.number.int({ min: 1, max: 10 }));
            } else if (flow.status !== ORDER_STATUS.REJECT) {
              timelineDate = new Date(returned_at);
            } else {
              timelineDate = new Date(pastDate);
            }
          } else if (timeline.created_at === 'created_at + 7 days') {
            timelineDate = new Date(pastDate);
            timelineDate.setDate(pastDate.getDate() + 7);
          } else {
            timelineDate = new Date(pastDate);
          }
          
          timeline.created_at = timelineDate.toISOString();
          mockOrderTimeline.push(timeline);
        }
        
        // After creating the order, process order_renews if it exists
        if (flow.order_renews) {
          const orderRenew = {
            ...flow.order_renews,
            order_id: flow.order_renews.order_id === '#orderId#' ? orderId : flow.order_renews.order_id,
          };
          
          // Calculate dates for the order renewal
          let oldDueDateObj;
          if (orderRenew.old_due_date === 'created_at + 7 days') {
            oldDueDateObj = new Date(createdDate);
            oldDueDateObj.setDate(createdDate.getDate() + 7);
          } else {
            oldDueDateObj = new Date(pastDate); // Default fallback
          }
          orderRenew.old_due_date = oldDueDateObj.toISOString();
          
          // Set the new due date
          if (orderRenew.new_due_date === 'is same date of order due_date') {
            orderRenew.new_due_date = due_date;
          }
          
          // Create a proper created_at for the renewal (typically between old and new due date)
          const renewDate = new Date(oldDueDateObj);
          renewDate.setDate(oldDueDateObj.getDate() - faker.number.int({ min: 1, max: 3 })); // Request made 1-3 days before due date
          orderRenew.created_at = renewDate.toISOString();
          
          mockOrderRenews.push(orderRenew);
        }
      }
    }

    // SEEDING orders
    console.log("Seeding orders...");
    const { error: ordersError } = await supabase.from("orders").upsert(mockOrders);
    if (ordersError) {
      console.error("[ERROR] inserting ORDERS:", ordersError);
    }

    // SEEDING notifications
    console.log("Sedding notifications...");
    const { error: notificationsError } = await supabase.from("notifications").upsert(mockNotifications);
    if (notificationsError) {
      console.error("[ERROR] inserting NOTIFICATIONS:", notificationsError);
    }

    // SEEDING order timeline
    console.log("Seeding order timeline...");
    const { error: timelineError } = await supabase.from("order_timeline").upsert(mockOrderTimeline);
    if (timelineError) {
      console.error("[ERROR] inserting ORDER_TIMELINE:", timelineError);
    }

    // SEEDING order_renews
    console.log("Seeding order renews...");
    if (mockOrderRenews.length > 0) {
      const { error: renewsError } = await supabase.from("order_renews").upsert(mockOrderRenews);
      if (renewsError) {
        console.error("[ERROR] inserting ORDER_RENEWS:", renewsError);
      }
    }

    console.log("DONE");
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}
