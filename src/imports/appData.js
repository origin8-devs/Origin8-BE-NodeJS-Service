module.exports = {
    business: { /** Business logic & Functional specifiers */
        usersCapacity: 500,
        maxRequestsPerSecond: 4,
        acceptableDuration: 1000
    },
    roles: {
        AppUser: 'AppUser',
        Admin: 'Admin',
        System: 'System', // Genetec System
        Data: 'Data' // Data Containers & Models
    },
    notificationType: {
        'FOLLOW_REQUEST': 1,
        'ON_OFF': 2,
        'ACCEPT': 3
    },
    Users: {
        type: {
            Admin: 0,
            Traveler: 1
        },
        plansSubscribed: {
            Free: 'F',
            Standard: 'S',
            VIP: 'V'
        },
        status: {
            'EMAIL_ADDED': 0,
            'PHONE_VERIFIED': 1,
            'WARNED': 2,
            'BLOCKED': 3
        },
        provider: {
            Google: 'Google',
            Facebook: 'FB',
            Cognito: 'Cognito',
            Apple: 'Apple'
        }
    },
    Trips: {
        type: {
            Public: "Public",
            Private: "Private"
        },
        status: {
            'OnGoing': 1,
            'Completed': 2
        }
    },
    Payments: {
        cardType: {
            Visa: "Visa",
            MasterCard: "MasterCard"
        }
    },
    Accommodation: {
        hotels: {
            ABCHotel: "ABCHotel"
        },
        flights: {
            Emirates: "Emirates"
        },
        carRentals: {
            ShanAuto: "ShanAuto"
        },
        Events: {
            FIFA: "FIFA"
        },
        Restaurants: {
            ShahiBiryani: "ShahiBiryani"
        }
    },
    Notifications: {
        type: {
            userFollowed: 1,
            TripUpdated: 2,
            Subscription: 3,
            TripBooked: 4,
            TravellerCancellation: 5,
            SubscriptionReminder: 6,
            UserCommented: 7,
            TripReminder: 8,
            UnSubscribed: 9,
            paymentFailure: 10,
            paymentSuccess: 11,
            TripDeleted: 12,
            paymentConfirmation: 13,
            ReviewReminder: 14,
            MessageSent: 15,
            TripShared: 16,
            RenewSubscriptionReminder: 17,
            BookingMadeForUser: 18,
            cardDeclined: 19,
            AdminMessage: 20,
        },
        headings: {
            1: 'Friend Updated',
            2: 'Trip Updated!',
            3: 'Subscription',
            4: 'Trip Booking',
            5: 'Traveller Cancellation',
            6: 'Payment Due!',
            7: 'New Comment!',
            8: 'Trip coming up!',
            9: 'Subscription',
            10: 'Payment Failure!',
            11: 'Payment Successful!',
            12: 'Trip Deleted!',
            13: 'Confirm Your Payment!',
            14: 'Leave a review!',
            15: 'New Message!',
            16: 'Trip Shared!',
            17: "Your Subscription is expiring tomorrow!",
            18: 'Pack your bags!',
            19: "Card Declined!",
            20: 'New Message from Roam Trips Admin!'
        }
    },
    AdminNotifications: {
        type: {
            TripCreated: 1,
            TripUpdated: 2,
            UserReported: 3,
            TripReported: 4,
            BlogReported: 5,
            BlogCreated: 6,
            TripDeleted: 7,
            BookingCreated: 8,
            VIPBooking: 9,
            Subscription: 10
        },
        headings: {
            1: 'Trip Created!',
            2: 'Trip Updated!',
            3: 'A User Was Reported!',
            4: 'A Trip Was Reported!',
            5: 'A Blog Was Reported!',
            6: 'A Blog Was Created!',
            7: 'A Blog Was Deleted!',
            8: 'New Booking!',
            9: 'New VIP Booking!',
            10: 'New Subscription!'
        }
    },
    Reports: {
        type: {
            User: 1,
            Trip: 2,
            Blog: 3,
        },
        actionTaken: {
            Warning: "Warning",
            Blocked: "Blocked",
        },
    },
    Terms: {
        types: {
            aboutUs: 1,
            termsAndConditions: 2
        }
    },
    LogTypes: {
        Success: "Success",
        Error: "Error"
    },
    TableNames: {
        Trips: 'Trips',
        Users: 'Users',
        BookTrips: 'BookTrips',
        Cards: 'Cards',
        Friends: 'Friends',
        Plans: 'Plans',
        Payments: 'Payments',
        Notifications: 'Notifications',
        NotificationHistory: 'NotificationHistory',
        AdminNotifications: 'AdminNotifications',
        UserSessions: 'UserSessions',
        WishList: 'WishList',
        Reviews: 'Reviews',
        Days: 'Days',
        Communities: 'Communities',
        Accommodation: 'Accommodation',
        AccommodationCategory: 'AccommodationCategory',
        Admin: 'Admin',
        AdminSessions: 'AdminSessions',
        Reports: 'Reports',
        PlanService: 'PlanService'
    },
    stripe: {
        logTypes: {
            Success: "Success",
            Failed: 'Failed'
        },
    },
    conversation: {
        types: {
            one_on_one: 1,
            group: 2,
            admin: 3,
            trip: 4
        }
    },
    AccessControl: {
        subscription: {
            approvedRoutes: [
                '/all',
                '/subscribePlan/:cardId',
                '/confirm_payment/:subscriptionId',
                '/subscribePlan',
                '/card/create',
                '/card/delete',
                '/cards',
                '/cards/update',
                '/logOut',
                '/verifyForgotPasswordOTP',
                '/resetPassword',
                '/complete-profile',
                '/resend/otp',
                '/verify/otp',
                '/verify/social/otp',
                '/allSignUp',
                '/subscribePlanSignUp',
                '/unSubscribe'
            ]
        }
    },
    Plans: {
        VIP: 6,
        Standard: 5,
        Free: 4
    }

}