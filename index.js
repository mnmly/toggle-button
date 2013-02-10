/**
 * Module dependencies
 */

var domify = require( 'domify' ),
    Drag   = require( 'drag' ),
    inherit = require( 'inherit' ),
    Emitter = require( 'emitter' ),
    style  = require( 'computed-style' ),
    css    = require( 'css' );

/**
 * Expose `ToggleButton`
 */

module.exports = ToggleButton;

/**
 * Initialize `ToggleButton`
 *
 * @param {Element} el target element
 * 
 * @api public
 */

function ToggleButton( el ) {

  Emitter.call( this );

  this.el = el;

  var handleEl = domify( '<div class="handle" />' )[0];
      elStyle  = style( this.el ),
      height   = parseInt( elStyle.height, 10 ),
      width    = parseInt( elStyle.width, 10 );

  css( handleEl, {
    width:    height,
    height:   height,
    position: 'absolute'
  } );

  this.el.appendChild( handleEl );

  this.offPosition = width - height;
  this.checkStatus = function( left ){ return left < ( width - height ) / 2 };
  this.handle      = new Drag( handleEl, { axis: 'x', range: { x: [0, this.offPosition ]}, smooth: true } );

  this.bind();
}


inherit( ToggleButton, Emitter );

/**
 * Bind events
 */

ToggleButton.prototype.bind = function() {
  var self = this;
  this.handle.on( 'dragend', function( e ){
    self.slide( self.checkStatus( self.handle.x ) )
  } );
};

/**
 * Slide the handle
 */

ToggleButton.prototype.slide = function( status ) {
  var pos = status ? 0 : this.offPosition;
  this.handle.setPosition( pos, this.handle.y );
  this.emit( 'toggle', status ? 'on' : 'off' );
};
