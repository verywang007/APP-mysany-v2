import { DeviceFrame } from '@/components/DeviceFrame/DeviceFrame';
import { Mine } from './Mine';
import './Mine.css';

export default function MinePage() {
  return (
    <DeviceFrame className="pg-mine kit">
      <Mine />
    </DeviceFrame>
  );
}
