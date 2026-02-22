import { render, screen, fireEvent } from '@testing-library/react';
import { Table, Column } from '../components/Table';

interface MockItem {
  id: string;
  name: string;
  status: string;
}

const mockData: MockItem[] = [
  { id: '1', name: 'Item Alpha', status: 'active' },
  { id: '2', name: 'Item Beta', status: 'inactive' },
  { id: '3', name: 'Item Gamma', status: 'active' },
];

const columns: Column<MockItem>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status', render: (item) => <span>{item.status.toUpperCase()}</span> },
];

describe('Table', () => {
  it('renders column headers', () => {
    render(<Table columns={columns} data={mockData} keyExtractor={(item) => item.id} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<Table columns={columns} data={mockData} keyExtractor={(item) => item.id} />);
    expect(screen.getByText('Item Alpha')).toBeInTheDocument();
    expect(screen.getByText('Item Beta')).toBeInTheDocument();
    expect(screen.getByText('Item Gamma')).toBeInTheDocument();
  });

  it('uses custom render function for columns', () => {
    render(<Table columns={columns} data={mockData} keyExtractor={(item) => item.id} />);
    expect(screen.getAllByText('ACTIVE')).toHaveLength(2);
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
  });

  it('shows empty message when data is empty', () => {
    render(
      <Table columns={columns} data={[]} keyExtractor={(item) => item.id} emptyMessage="No items found" />
    );
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('shows loading skeletons when isLoading is true', () => {
    render(
      <Table columns={columns} data={[]} keyExtractor={(item) => item.id} isLoading loadingRows={3} />
    );
    expect(screen.queryByText('Item Alpha')).not.toBeInTheDocument();
  });

  it('calls onSort when sortable header is clicked', () => {
    const onSort = jest.fn();
    render(
      <Table
        columns={columns}
        data={mockData}
        keyExtractor={(item) => item.id}
        onSort={onSort}
        sortColumn="name"
        sortDirection="asc"
      />
    );
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('sets aria-sort on sorted column header', () => {
    render(
      <Table
        columns={columns}
        data={mockData}
        keyExtractor={(item) => item.id}
        sortColumn="name"
        sortDirection="asc"
      />
    );
    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('calls onRowClick when a row is clicked', () => {
    const onRowClick = jest.fn();
    render(
      <Table
        columns={columns}
        data={mockData}
        keyExtractor={(item) => item.id}
        onRowClick={onRowClick}
      />
    );
    fireEvent.click(screen.getByText('Item Alpha'));
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('has accessible table label', () => {
    render(<Table columns={columns} data={mockData} keyExtractor={(item) => item.id} />);
    expect(screen.getByLabelText('Data table')).toBeInTheDocument();
  });
});
