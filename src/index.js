import requestAnimationFrame from 'dom-helpers/util/requestAnimationFrame';

const regex = new RegExp('[0-9]+');

const animal = (target, props, duration, easing) => new Promise((resolve, reject) => {
  const propertyName = Object.keys(props)[0];
  let finalValue = props[propertyName];
  const initialValue = parseFloat(target[propertyName], 10) || 0;
  let prefix = null;
  let suffix = null;
  if (typeof finalValue === 'string') {
    let parsedValue = parseFloat(finalValue, 10);
    if (isNaN(parsedValue)) {
      parsedValue = regex.exec(finalValue)[0];
    }
    const splitted = finalValue.split('' + parsedValue);
    suffix = splitted.length > 1 ? splitted[1] : splitted[0];
    prefix = splitted.length > 1 ? splitted[0] : null;
    finalValue = parsedValue;
  }
  const endTime = Date.now() + duration;
  const valueDelta = finalValue - initialValue;

  const render = () => {
    const progress = Math.min((duration - (endTime - Date.now())) / duration, 1);
    const easingProgress = easing ? easing(progress) : progress;

    let nextValue = initialValue + (valueDelta * easingProgress);
    if (suffix) {
      nextValue = '' + nextValue + suffix;
    }
    if (prefix) {
      nextValue = prefix + '' + nextValue;
    }
    target[propertyName] = nextValue;

    if (progress < 1) {
      window.requestAnimationFrame(render);
    } else {
      resolve();
      return;
    }
  };
  render();
});

export default animal;
