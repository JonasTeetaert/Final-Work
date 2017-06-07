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
    // TODO: bij 2 verschillende instrumenten die tezamen gespeeld worden: gain te hoog 'gekraak'

  }
  threeController.render();
  window.requestAnimFrame(render);
}