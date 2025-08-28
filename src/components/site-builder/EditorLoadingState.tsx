
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface LoadingStep {
  id: string;
  label: string;
  completed: boolean;
}

interface EditorLoadingStateProps {
  currentStep: string;
  progress: number;
}

const EditorLoadingState = ({ currentStep, progress }: EditorLoadingStateProps) => {
  const steps: LoadingStep[] = [
    { id: 'auth', label: 'Vérification de l\'authentification', completed: progress > 20 },
    { id: 'stores', label: 'Chargement des boutiques', completed: progress > 40 },
    { id: 'template', label: 'Chargement du template', completed: progress > 60 },
    { id: 'editor', label: 'Initialisation de l\'éditeur', completed: progress > 80 },
    { id: 'ready', label: 'Finalisation', completed: progress === 100 }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded animate-spin"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chargement de l'éditeur
          </h2>
          <p className="text-sm text-gray-600">
            Préparation de votre espace de création...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-2 text-center">
            {progress}% terminé
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                step.id === currentStep ? 'bg-blue-50' : step.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                step.completed ? 'bg-green-500' : step.id === currentStep ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
              }`}></div>
              <span className={`text-sm ${
                step.completed ? 'text-green-700' : step.id === currentStep ? 'text-blue-700' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Editor Preview Skeleton */}
        <div className="mt-8 border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLoadingState;
