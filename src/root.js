/**
 * root.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * ## exported
 *
 * @return {Function} function that augment Microbe.
 */
module.exports = function( Microbe )
{
    var Types       = require( './utils/types' );
    var _type       = Microbe.core.type;


    /**
     * ## capitalize
     *
     * capitalizes every word in a string or an array of strings and returns the
     * type that it was given
     *
     * @param {Mixed} text                string(s) to capitalize _{String or Array}_
     *
     * @return {Mixed} {String or Array} capitalized string(s)
     */
    Microbe.capitalize = function( text )
    {
        var array   = Microbe.isArray( text );
        text        = !array ? [ text ] : text;

        for ( var i = 0, lenI = text.length; i < lenI; i++ )
        {
            text[ i ] = text[ i ].split( ' ' );
            for ( var j = 0, lenJ = text[ i ].length; j < lenJ; j++ )
            {
                text[ i ][ j ] = text[ i ][ j ].charAt( 0 ).toUpperCase() + text[ i ][ j ].slice( 1 );
            }
            text[ i ] = text[ i ].join( ' ' );
        }

        return ( array ) ? text : text[ 0 ];
    };


    // british people....
    Microbe.capitalise = Microbe.capitalize;


    /**
     * ## debounce
     *
     *  Returns a function, that, as long as it continues to be invoked, will not
     *  be triggered. The function will be called after it stops being called for
     *  [[wait]] milliseconds. If `immediate` is passed, trigger the function on
     *  the leading edge, instead of the trailing.
     *
     * @param {Function} _func               function to meter
     * @param {Number} wait                milliseconds to wait
     * @param {Boolean} immediate           run function at the start
     *                                                  of the timeout
     *
     * @return {Function} */
    Microbe.debounce = function( _func, wait, immediate )
    {
        var timeout;

        return function()
        {
            var context = this,
                args    = arguments;

            var later   = function()
            {
                timeout = null;

                if ( !immediate )
                {
                    _func.apply( context, args );
                }
            };

            var callNow = immediate && !timeout;
            clearTimeout( timeout );
            timeout     = setTimeout( later, wait );

            if ( callNow )
            {
                _func.apply( context, args );
            }
        };
    };


    Microbe.extend = Microbe.core.extend;


    /**
     * ## identity
     *
     * returns itself if a value needs to be executed
     *
     * @param {any} value               any value
     *
     * @return _any_
     */
    Microbe.identity = function( value ) { return value; };


    /**
     * ## insertStyle
     *
     * builds a style tag for the given selector/ media query.  Reference to the style
     * tag and object is saved in µ.__customCSSRules[ selector ][ media ].
     * next rule with the same selector combines the old and new rules and overwrites
     * the contents
     *
     * @param {String} selector            selector to apply it to
     * @param {Mixed} cssObj              css object. _{String or Object}_
     * @param {String} media               media query
     *
     * @return {Mixed} {Microbe or Style }
     */
    Microbe.insertStyle = function( selector, cssObj, media )
    {
        var _s      = selector.replace( / /g, '-' );
        var _clss   = media ? _s +  media.replace( /[\s:\/\[\]\(\)]+/g, '-' ) : _s;

        media       = media || 'none';

        var createStyleTag = function()
        {
            var el = document.createElement( 'style' );
            el.className = 'microbe--inserted--style__' + _clss;

            if ( media && media !== 'none' )
            {
                el.setAttribute( 'media', media );
            }

            document.head.appendChild( el );

            return el;
        };

        var _el, prop;
        var styleObj =  Microbe.__customCSSRules[ _s ];

        if ( styleObj && styleObj[ media ] )
        {
            _el     = styleObj[ media ].el;
            var obj = styleObj[ media ].obj;

            for ( prop in cssObj )
            {
                obj[ prop ] = cssObj[ prop ];
            }

            cssObj = obj;
        }
        else
        {
            _el = createStyleTag();
        }

        var css = selector + '{';
        for ( prop in cssObj )
        {
            css += prop + ' : ' + cssObj[ prop ] + ';';
        }
        css += '}';

        _el.innerHTML = css;

        Microbe.__customCSSRules[ _s ] = Microbe.__customCSSRules[ _s ] || {};
        Microbe.__customCSSRules[ _s ][ media ] = { el: _el, obj: cssObj };

        return _el;
    };

    // keep track of tags created with insertStyle
    Microbe.__customCSSRules = {};


    /**
     * ## isArray
     *
     * native isArray for completeness
     *
     * @type {Function}
     */
    Microbe.isArray = Array.isArray;


    /**
     * ## isEmpty
     *
     * Checks if the passed object is empty
     *
     * @param {Object} obj                 object to check
     *
     * @return {Boolean} empty or not
     */
    Microbe.isEmpty = function( obj )
    {
        var name;
        for ( name in obj )
        {
            return false;
        }

        return true;
    };


    /**
     * ## isFunction
     *
     * Checks if the passed parameter is a function
     *
     * @param {Object} obj                 object to check
     *
     * @return {Boolean} function or not
     */
    Microbe.isFunction = function( obj )
    {
        return Microbe.type( obj ) === "function";
    };


    /**
     * ## isObject
     *
     * Checks if the passed parameter is an object
     *
     * @param {Object} obj                 object to check
     *
     * @return {Boolean} isObject or not
     */
    Microbe.isObject = function( obj )
    {
        if ( Microbe.type( obj ) !== "object" || obj.nodeType || Microbe.isWindow( obj ) )
        {
            return false;
        }

        return true;
    };


    /**
     * ## isUndefined
     *
     * Checks if the passed parameter is undefined
     *
     * @param {String} obj                 property
     * @param {Object} parent              object to check
     *
     * @return {Boolean} obj in parent
     */
    Microbe.isUndefined = function( obj, parent )
    {
        if ( parent && typeof parent !== 'object' )
        {
            return true;
        }

        return parent ? !( obj in parent ) : obj === void 0;
    };


    /**
     * ## isWindow
     *
     * Checks if the passed parameter equals window
     *
     * @param {Object} obj                 object to check
     *
     * @return {Boolean} isWindow or not
     */
    Microbe.isWindow = function( obj )
    {
        return obj !== null && obj === obj.window;
    };


    Microbe.merge = Microbe.core.merge;


    /**
     * ## noop
     *
     * Nothing happens
     *
     * https://en.wikipedia.org/wiki/Xyzzy_(computing)
     *
     * @return {void} */
    Microbe.noop    = function() {};


    /**
     * ## once
     *
     * returns a function that can only be run once
     *
     * @param {Function} _func                         function to run once
     *
     * @return {Function} */
    Microbe.once = function( _func, context )
    {
        var result;

        return function()
        {
            if( _func )
            {
                result  = _func.apply( context || this, arguments );
                _func   = null;
            }
            else
            {
                result  = null;
            }

            return result;
        };
    };


    /**
     * ## poll
     *
     * checks a passed function for true every [[interval]] milliseconds.  when
     * true, it will run _success, if [[timeout[[]] is reached without a success,
     * _error is excecuted
     *
     * @param {Function} _func                         function to check for true
     * @param {Function} _success                      function to run on success
     * @param {Function} _error                        function to run on error
     * @param {Number} timeout                       time (in ms) to stop polling
     * @param {Number} interval                      time (in ms) in between polling
     *
     * @return {Function} */
    Microbe.poll = function( _func, _success, _error, timeout, interval )
    {
        var endTime = Number( new Date() ) + ( timeout || 2000 );
        interval    = interval || 100;

        ( function p()
        {
            if( _func() )
            {
                _success();
            }
            else if ( Number( new Date() ) < endTime )
            {
                setTimeout( p, interval );
            }
            else {
                _error( new Error( 'timed out for ' + _func + ': ' + arguments ) );
            }
        } )();
    };


    /**
     * ## removeStyle
     *
     * removes a microbe added style tag for the given selector/ media query. If the
     * properties array is passed, rules are removed individually.  If properties is
     * set to true, all tags for this selector are removed.  The media query can
     * also be passed as the second variable
     *
     * @param {String} selector            selector to apply it to
     * @param {Mixed} properties          css properties to remove
     *                                                  'all' to remove all selector tags
     *                                                  string as media query {String or Array}
     * @param {String} media               media query
     *
     * @return {Boolean} */
    Microbe.removeStyle = function( selector, properties, media )
    {
        if ( !media && typeof properties === 'string' && properties !== 'all' )
        {
            media = properties;
            properties = null;
        }

        media = media || 'none';

        var _removeStyle = function( _el, _media )
        {
            _el.parentNode.removeChild( _el );
            delete Microbe.__customCSSRules[ selector ][ _media ];
        };

        var style = Microbe.__customCSSRules[ selector ];

        if ( style )
        {
            if ( properties === 'all' )
            {
                for ( var _mq in style )
                {
                    _removeStyle( style[ _mq ].el, _mq );
                }
            }
            else
            {
                style = style[ media ];

                if ( style )
                {
                    if ( Microbe.isArray( properties ) && !Microbe.isEmpty( properties ) )
                    {
                        for ( var i = 0, lenI = properties.length; i < lenI; i++ )
                        {
                            if ( style.obj[ properties[ i ] ] )
                            {
                                delete style.obj[ properties[ i ] ];
                            }
                        }
                        if ( Microbe.isEmpty( style.obj ) )
                        {
                            _removeStyle( style.el, media );
                        }
                        else
                        {
                            Microbe.insertStyle( selector, style.obj, media );
                        }
                    }
                    else
                    {
                        _removeStyle( style.el, media );
                    }
                }
                else
                {
                    return false;
                }
            }

        }
        else
        {
            return false;
        }

        return true;
    };


    /**
     * ## removeStyles
     *
     * removes all microbe added style tags for the given selector
     *
     * @param {String} selector            selector to apply it to
     *
     * @return {Boolean} */
    Microbe.removeStyles = function( selector )
    {
        return Microbe.removeStyle( selector, 'all' );
    };


    /**
     * ## toArray
     *
     * Methods returns all the elements in an array.
     *
     * @return _Array_
     */
    Microbe.toArray = Microbe.core.toArray;


    /**
     * ## toString
     *
     * Methods returns the type of Microbe.
     *
     * @return _String_
     */
    Microbe.toString = Microbe.core.toString;


    /**
     * ## type
     *
     * returns the type of the parameter passed to it
     *
     * @param {all} obj                 parameter to test
     *
     * @return {String} typeof obj
     */
    Microbe.type = function( obj )
    {
        if ( obj === null )
        {
            return obj + '';
        }

        var type = Types[ Object.prototype.toString.call( obj ) ];
            type = !type ? Types[ obj.toString() ] : type;
        return  type || typeof obj;
    };


    /**
     * ## xyzzy
     *
     * https://en.wikipedia.org/wiki/Xyzzy_(computing)
     *
     * @return {void} */
    Microbe.xyzzy   = Microbe.noop;
};
