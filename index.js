const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use( require('body-parser').json() );

const userData = {
    id: 1,
    name: "John Smith",
    email: 'user@email.com',
    phone: '0166778899',
};

const products = [
    {
        id: 1,
        title: 'Executive Men Dress Shoe',
        image: 'https://images-na.ssl-images-amazon.com/images/I/41bUZ2MaA2L._AC_SR160,160_.jpg',
        price: 82.50
    },
    {
        id: 2,
        title: 'Medfield Plain Toe Oxford Dress Shoe',
        image: 'https://images-na.ssl-images-amazon.com/images/I/41Xa9Db6k8L._AC_SR160,160_.jpg',
        price: 110.80
    },
    {
        id: 3,
        title: 'James Wingtip Cognac Soft',
        image: 'https://images-na.ssl-images-amazon.com/images/I/418NzYVJT4L._AC_SR160,160_.jpg',
        price: 63.30
    },
    {
        id: 4,
        title: 'Echo Dot (3rd Gen) bundle with Amazon Smart Plug',
        image: 'https://images-na.ssl-images-amazon.com/images/I/51OaV%2BEwz7L._AC_UL270_SR270,270_.jpg',
        price: 49.98
    },
    {
        id: 5,
        title: 'Echo Plus (2nd Gen) - Premium sound with built-in smart home hub',
        image: 'https://images-na.ssl-images-amazon.com/images/I/71I6oj6ZFBL._AC_UL270_SR270,270_.jpg',
        price: 149.99
    },
    {
        id: 6,
        title: 'Echo Show (2nd Gen) – Premium sound and a vibrant',
        image: 'https://images-na.ssl-images-amazon.com/images/I/418NzYVJT4L._AC_SR160,160_.jpg',
        price: 229.99
    }
];

function unAuthenticated( response ) {
    return response.status( 401 ).send( {
        success: false,
        message: 'You must logged in to continue.'
    } );
}

/**
 * Auth Middleware
 */
app.use( function( request, response, next ) {
    var authorization = request.headers.authorization;
    if ( authorization ) {
        var token = request.headers.authorization.split(" ")[1];
        jwt.verify( token, 'secret', function( error, payload ) {
            if ( payload.email === userData.email ) {
                request.authUser = userData;
            }
        });
    }

    next();
} );

/**
 * Get products
 */
app.get( '/', ( request, response ) => {
    response.json( products );
} );

/**
 * Login
 */
app.post( '/auth/login', function( request, response ) {
    if ( userData.email == request.body.email && 'demo' == request.body.password ) {
        var user = Object.assign( {}, userData );
        var token = jwt.sign( { email: user.email }, 'secret', { expiresIn: 43200 } );
        user.token = token;

        response.json( user );
    } else {
        response.status(400).json( {
            success: false,
            message: 'Invalid username or password.'
        } );
    }
} );

/**
 * Checkout
 */
app.post( '/checkout', function( request, response ) {
    // Check authenticate
    if ( ! request.authUser ) {
        return unAuthenticated( response );
    }

    response.json( {
        success: true,
        message: 'Thank You'
    } );
} );

/**
 * Route not found (404)
 */
app.use( function( request, response ) {
    return response.status( 404 ).send( {
        success: false,
        message: 'Route "' + request.url + '" Not found.'
    } );
} );

app.listen( 3001, ()=>{
    console.log('done.....')
});
