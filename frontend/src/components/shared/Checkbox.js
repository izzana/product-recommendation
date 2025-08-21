import React from 'react';

function Checkbox({ children, ...props }) {
  return (
    <label className="flex items-center">
      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" {...props} />
      <span className="ml-4 text-sm">{children}</span>
    </label>
  );
}

export default Checkbox;
