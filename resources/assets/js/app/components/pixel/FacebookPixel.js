import ReactPixel from 'react-facebook-pixel';

const advancedMatching = { em: 'usmanraza5245@gmail.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
const options = {
  autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  debug: false, // enable logs
};
ReactPixel.init('3080888038858973', advancedMatching, options);


export default ReactPixel;