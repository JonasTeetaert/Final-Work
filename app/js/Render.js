/**
 * Created by driesc on 31/05/2017.
 */
function render() {
  if (fps.update()) {
    frame = leapController.controller.frame();

    if (frame.hands.length > 0) {
      for (var i = 0; i < frame.hands.length; i++) {
        if (frame.hands[i].type === 'left') {
          leftHand.update(i);
        }

        if (frame.hands[i].type === 'right') {
          rightHand.update(i);
        }
      }
    }

    menu.checkPlayMode();

  }
  threeController.render();
  window.requestAnimFrame(render);

}