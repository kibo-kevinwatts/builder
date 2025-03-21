import { RegisteredComponent } from '../context/types.js';
import type { ComponentInfo, Input } from '../types/components.js';

/**
 * @deprecated.  Use the `customComponents` prop in RenderContent instead to provide your custom components to the builder SDK.
 */
export const components: RegisteredComponent[] = [];

/**
 * @deprecated.  Use the `customComponents` prop in RenderContent instead to provide your custom components to the builder SDK.
 */
export function registerComponent(component: any, info: ComponentInfo): void {
  components.push({ component, ...info });

  console.warn(
    'registerComponent is deprecated. Use the `customComponents` prop in RenderContent instead to provide your custom components to the builder SDK.'
  );

  return component;
}

export const createRegisterComponentMessage = ({
  component: _,
  ...info
}: RegisteredComponent) => ({
  type: 'builder.registerComponent',
  data: prepareComponentInfoToSend(info),
});

/**
 * We need to serialize values to a string in case there are Proxy values, as is the case with SolidJS etc.
 */
const fastClone = <T extends object>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

const serializeValue = (value: object): any =>
  typeof value === 'function' ? serializeFn(value) : fastClone(value);

/**
 * Input attributes that are functions must be converted to strings before being serialized to JSON.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const serializeFn = (fnValue: Function) => {
  const fnStr = fnValue.toString().trim();
  // we need to account for a few different fn syntaxes:
  // 1. `function name(args) => {code}`
  // 2. `name(args) => {code}`
  // 3. `(args) => {}`
  const appendFunction =
    !fnStr.startsWith('function') && !fnStr.startsWith('(');

  return `return (${
    appendFunction ? 'function ' : ''
  }${fnStr}).apply(this, arguments)`;
};

const prepareComponentInfoToSend = ({
  inputs,
  ...info
}: ComponentInfo): ComponentInfo => ({
  ...fastClone(info),
  inputs: inputs?.map(
    (input): Input =>
      Object.entries(input).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: serializeValue(value),
        }),
        {} as Input
      )
  ),
});
