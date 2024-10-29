import { Card } from '@/components/ui/card';
import React from 'react';
import Portfolio from './portfolio/page';

const Page = () => {

  return (
    <div className="flex justify-center items-center h-full w-full p-4">
      <div className="flex-1 h-full">
        <Card className='h-full w-full rounded-md shadow-none'>
          <div className="p-4">
            <Portfolio />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;