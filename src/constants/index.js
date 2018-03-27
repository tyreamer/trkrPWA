export const routes = {
    LANDING: '/',
    SIGN_UP : '/signup',
    SIGN_IN : '/signin',
    PASSWORD_FORGET : '/pw-forget',
    HOME : '/home',
    ACCOUNT : '/account',
    PROFILE : '/profile',
    CREATE : '/create',
    CREATE_TIP : '/create-tip',
    CREATE_RESOURCE : '/create-resource',
    CREATE_TRIP : '/create-trip',
    SEARCH : '/search',
}

export const databaseSchema = {
    TREKS: {
        root: 'treks',
        children: {

        }
    },
    USER_TREKS: {
        root: 'user-posts',
        children: {

        }
    },
    TIPS: {
        root: 'tips',
        children: {

        }
    },
    USER_TIPS: {
        root: 'user-tips',
        children: {

        }
    },
    RESOURCES: {
        root: 'resources',
        children: {

        }
    },
    USER_RESOURCES: {
        root: 'user-resources',
        children: {

        }
    },
    USERS: {
        root: 'users',
        children: {

        }
    },
    LIKES: {
        root: 'likes',
        children: {

        }
    }, 
    TAGS: {
        root: 'tags',
        children: {

        }
    }
}
