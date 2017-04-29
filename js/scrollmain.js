(function($) {
   console.log("called pinning function")
	var wh = window.innerHeight;

	// init
	var ctrl = new ScrollMagic.Controller({
	    globalSceneOptions: {
	        triggerHook: 'onLeave'
	    }
	});

	// Create scene
	$("section").each(function() {

		var name = $(this).attr('id');
      //return early on image sets
      if (name != "about"){
         return;
      }
		new ScrollMagic.Scene({
			triggerElement: this
		})
		.setPin(this)
		.addIndicators({
			colorStart: "rgba(255,255,255,0.5)",
			colorEnd: "rgba(255,255,255,0.5)",
			colorTrigger : "rgba(255,255,255,1)",
			name:name
		})
		.loglevel(3)
		.addTo(ctrl);

	});
   $("header").each(function() {

      var name = $(this).attr('id');
      new ScrollMagic.Scene({
         triggerElement: this
      })
      .setPin(this)
      .loglevel(3)
      .addTo(ctrl);

   });
	new ScrollMagic.Scene({
		duration: '20%',
		offset: wh+(wh/2)
	})
	.triggerElement($('body')[0])
	.setClassToggle('body', 'arrowsOn')
	.addTo(ctrl);

	new ScrollMagic.Scene({
		offset: (wh*3)
	})
	.triggerElement($('body')[0])
	.setClassToggle('section#four', 'is-active')
	.addTo(ctrl);

})(jQuery);
