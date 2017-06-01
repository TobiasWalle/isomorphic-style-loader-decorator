import * as PropTypes from 'prop-types';
import * as React from 'react';

/**
 * Register the component styles.
 * @param styles The styles you want to assign.
 * @return {(target:any)=>void} A function that wraps the target with the provided styles.
 */
export function WithStyles(styles: any): any {
  return function<T extends {new (...args: any[]): React.Component<any, any>}>(Component: T) {
    // Add context types
    Component['contextTypes'] = {
      ...Component['contextTypes'] || {},
      insertCss: PropTypes.func
    };

    class ComponentWithStyles extends Component {
      removeCss: () => void;

      componentWillMount() {
        if (this.context.insertCss) {
          this.removeCss = this.context.insertCss(styles);
        }

        // Call the original function
        const componentWillMount = super['componentWillMount'];
        componentWillMount && componentWillMount.bind(this)();
      }

      componentWillUnmount() {
        // Call the original function
        const componentWillUnmount = super['componentWillUnmount'];
        componentWillUnmount && componentWillUnmount.bind(this)();

        // Remove the css
        setTimeout(this.removeCss, 0);
      }
    }

    // Set the old class name
    Object.defineProperty(ComponentWithStyles, 'name', {
      value: Component['name'],
      writable: false
    });

    return ComponentWithStyles;
  }
}