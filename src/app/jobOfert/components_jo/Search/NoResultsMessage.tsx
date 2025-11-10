type NoResultsMessageProps = {
  search: string;
};

export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ search }) => (
  <div className="text-center py-12">
    <p className="text-gray-500 text-xl font-roboto font-normal">
      No se encontraron resultados
      {(search ?? '').trim() && (
        <>
          {' '}
          para <span className="font-bold">&quot;{search.trim()}&quot;</span>
        </>
      )}
    </p>
  </div>
);
