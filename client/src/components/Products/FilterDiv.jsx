
import { CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';

import React, { useState } from 'react';
import Dropdown from './Dropdown.jsx';
import PriceSlider from './PriceSlider.jsx';






export default function FilterDiv({type}) {
  

  return (
    <div className="filterDiv">
        
        <Dropdown 
        type={type}
        />
        <PriceSlider className="priceSlider"
        type={type} />
    </div>
  );
}
