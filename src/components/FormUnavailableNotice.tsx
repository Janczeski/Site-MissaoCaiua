import { AlertCircle } from 'lucide-react';

// Aviso fixo (não editável no admin) dos formulários que ainda não enviam nada.
// Quando o envio real existir, remova o aviso e o <fieldset disabled> do formulário.
const FormUnavailableNotice = ({ children }: { children: string }) => (
  <div
    role="status"
    className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-left text-sm text-amber-900 font-nunito"
  >
    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
    <p>{children}</p>
  </div>
);

export default FormUnavailableNotice;
