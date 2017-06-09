/**
 * Created by driesc on 31/05/2017.
 */
function render() {
  if (fps.update()) {
    frame = leapController.controller.frame();

    leftHand.update();
    rightHand.update();

  }
  
  threeController.render();
  window.requestAnimFrame(render);
}