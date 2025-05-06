import { Comment } from '@/services/api/commentService';

interface CommentCardProps {
  comment: Comment;
  key: number;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-300 font-medium">
              {comment.by.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{comment.by}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Acheté le {new Date(comment.dateBuy).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 ${
                index < parseInt(comment.note)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <h5 className="font-medium text-gray-900 dark:text-white mb-2">{comment.messageTitle}</h5>
      <p className="text-gray-600 dark:text-gray-300">{comment.message}</p>
    </div>
  );
}
