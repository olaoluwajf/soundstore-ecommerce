import React, { createContext, useContext, useState } from 'react';
const ConfirmContext = createContext();
export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, message: '', resolve: null });
  const confirm = (message) => new Promise(res => setState({ open: true, message, resolve: res }));
  const cancel = () => { if (state.resolve) state.resolve(false); setState({ open:false, message:'', resolve:null }); };
  const ok = () => { if (state.resolve) state.resolve(true); setState({ open:false, message:'', resolve:null }); };
  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.open && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>{state.message}</p>
            <div className="confirm-actions">
              <button className="btn cancel" onClick={cancel}>Cancel</button>
              <button className="btn ok" onClick={ok}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
export function useConfirm(){ return useContext(ConfirmContext); }
