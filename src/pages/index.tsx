import type {ReactElement} from 'react';
import {Redirect} from '@docusaurus/router';

export default function Home(): ReactElement {
  return <Redirect to="/docs/" />;
}
