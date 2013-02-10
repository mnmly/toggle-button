/**
 * Module dependencies
 */

var domify = require( 'domify' ),
    events = require( 'events' ),
    classes = require( 'classes' ),
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
  if( !( this instanceof ToggleButton ) ) return new ToggleButton( el );

  Emitter.call( this );

  this.el      = el;
  this.status  = true;

  classes( this.el ).add( 'toggle-button' );
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

/**
 * Inherit `Emitter`
 */

inherit( ToggleButton, Emitter );

/**
 * Bind events
 */

ToggleButton.prototype.bind = function() {
  var self = this;
  
  this.handle.on( 'dragend', function( e ){
    self.slide( self.checkStatus( self.handle.x ) )
  } );

  this.events = events( this.el, this );
  
  if ( 'ontouchstart' in document.documentElement ) {
    this.events.bind( 'touchstart' );
  } else{
    this.events.bind( 'click', 'ontouchstart' );
  }
};

/**
 * touchstart
 */

ToggleButton.prototype.ontouchstart = function( e ) {
  e.preventDefault();
  e.stopPropagation();
  if ( !classes( e.target ).has( 'handle' ) ) {
    this.slide( !this.status );
  }
};

/**
 * Slide the handle
 */

ToggleButton.prototype.slide = function( status ) {
  var pos = status ? 0 : this.offPosition;
  this.handle.setPosition( pos, this.handle.y || 0 );
  this.status = status;
  this.emit( 'toggle', status ? 'on' : 'off' );
};
