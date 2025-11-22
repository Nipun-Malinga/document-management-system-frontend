import { Drawer } from '@/components';
import InfoTabs from './InfoTabs';

const InfoDrawer = () => {
  return (
    <Drawer title='Version Information'>
      <InfoTabs />
    </Drawer>
  );
};

export default InfoDrawer;
