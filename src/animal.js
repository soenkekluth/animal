import animationFrame from 'dom-helpers/util/requestAnimationFrame';

const regex = new RegExp('[0-9]+');

const animal = (target, props, duration, easing) => new Promise((resolve, reject) => {
  const keys = Object.keys(props);
  const propertyName = keys[0];
  const attributeIndex = keys.indexOf('attribute');
  const isAttribute = attributeIndex > -1 ? keys[attributeIndex] : false;
  const initialValue = props.from || (isAttribute ? parseFloat(regex.exec(target.getAttribute(propertyName))[0], 10) : parseFloat(target[propertyName], 10) || 0);
  let finalValue = props[propertyName];

  let prefix = null;
  let suffix = null;

  if (typeof finalValue === 'string') {
    let parsedValue = parseFloat(finalValue, 10);
    if (isNaN(parsedValue)) {
      parsedValue = regex.exec(finalValue)[0];
    }
    const splitted = finalValue.split(`${parsedValue}`);
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
      nextValue = `${nextValue}${suffix}`;
    }
    if (prefix) {
      nextValue = `${prefix}${nextValue}`;
    }
    if (isAttribute) {
      target.setAttribute(propertyName, nextValue);
    } else {
      target[propertyName] = nextValue;
    }

    if (progress < 1) {
      animationFrame(render);
    } else {
      resolve();
    }
  };
  render();
});

export const animalGroup = animals => Promise.all(animals);

export const nextFrame = (...args) => new Promise((resolve) => {
  animationFrame(resolve(...args));
});

export const delay = (ms = 0, ...args) => new Promise((resolve, reject) => {
  setTimeout(() => {
    nextFrame()
      .then(() => resolve(ms, ...args));
  }, ms);
});


export default animal;
