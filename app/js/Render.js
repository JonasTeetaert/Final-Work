/**
 * Created by driesc on 31/05/2017.
 */
function render() {
  if (fps.update()) {
    frame = leapController.controller.frame();

    leftHand.update();

    rightHand.update();

    menu.checkPlayMode();
    // TODO: warning bij effect op elk hand?

  }
  threeController.render();
  window.requestAnimFrame(render);

}