function List({ data }) {
  return (
    <>
      {data.map((list, index) => {
        return (
          <tr key={list.id}>
            <td>{index + 1}</td>
            <td>{list.nama_kegiatan}</td>
            <td>{list.realisasi}</td>
          </tr>
        );
      })}
    </>
  );
}

export default List;
