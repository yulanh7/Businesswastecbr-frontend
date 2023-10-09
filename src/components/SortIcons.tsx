import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';



interface SortIconProps {
  column: string;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string, direction: "asc" | "desc") => void;
}

const SortIcons: React.FC<SortIconProps> = ({ column, sortColumn, sortDirection, onSort }) => {
  return (
    <span className='sort-table-icon'>
      <FontAwesomeIcon
        icon={faCaretUp}
        onClick={() => onSort(column, 'asc')}
        className={sortColumn === column && sortDirection === 'asc' ? "active" : "inactive"}
      />
      <FontAwesomeIcon
        icon={faCaretDown}
        onClick={() => onSort(column, 'desc')}
        className={sortColumn === column && sortDirection === 'desc' ? "active" : "inactive"}
      />
    </span>
  );
};

export default SortIcons;
