import { useIonToast } from "@ionic/react";


export const useToast = () => {
  const [present] = useIonToast()

  const toast = (message: string, position?: 'top' | 'middle' | 'bottom') => {
    present({
    message: message,
    duration: 4000,
    position: position
  })
}

  return toast
}