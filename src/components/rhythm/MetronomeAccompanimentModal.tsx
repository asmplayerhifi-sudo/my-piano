import React from 'react';
import { MetronomeAccompanimentStudio } from './MetronomeAccompanimentStudio';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * @deprecated Use MetronomeAccompanimentStudio diretamente na tela.
 * Mantido para compatibilidade reversa caso algum módulo antigo requisite.
 */
export const MetronomeAccompanimentModal: React.FC<Props> = ({ isOpen = true }) => {
  if (!isOpen) return null;
  return <MetronomeAccompanimentStudio />;
};

export default MetronomeAccompanimentModal;
