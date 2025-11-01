import { cn, getImageUrl } from "../../../services/Util";

interface UserAvatarProps {
  user: {
    pessoa?: {
      urlImg?: string;
      nome?: string;
      genero?: string;
    };
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar = ({ user, size = 'md', className }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(part => part[0]).join('').slice(0, 2);
  };

  const genderColor = user.pessoa?.genero?.toLowerCase() === 'feminino' 
    ? 'bg-pink-100 text-pink-600' 
    : 'bg-blue-100 text-blue-600';

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-medium flex-shrink-0',
      sizeClasses[size],
      !user.pessoa?.urlImg && genderColor,
      className
    )}>
      {user.pessoa?.urlImg ? (
        <img 
          src={getImageUrl(`storage/${user.pessoa.urlImg}`)} 
          alt={user.pessoa.nome} 
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-lg font-medium">
          {getInitials(user.pessoa?.nome)}
        </span>
      )}
    </div>
  );
};