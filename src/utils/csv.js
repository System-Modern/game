/**
 * Utility to export sold accounts report as CSV
 */
export const exportSoldAccountsCSV = (accounts) => {
  const soldList = accounts.filter(acc => acc && (acc.is_sold || acc.status === 'SOLD'));
  if (soldList.length === 0) {
    return { success: false, message: 'Tidak ada data penjualan untuk diexport ke CSV.' };
  }

  const headers = [
    'No',
    'Game',
    'Username',
    'Email Akun',
    'Email Pembeli',
    'Dibeli Oleh (Buyer)',
    'Harga Jual',
    'Dijual Oleh (Seller)',
    'Tanggal Terjual'
  ];

  const rows = soldList.map((acc, index) => {
    const sell = Number(acc.sell_price) || 0;
    return [
      index + 1,
      `"${acc.game || '-'}"`,
      `"${acc.username || '-'}"`,
      `"${acc.email || '-'}"`,
      `"${acc.buyer_email || '-'}"`,
      `"${acc.bought_by || '-'}"`,
      sell,
      `"${acc.sold_by || '-'}"`,
      `"${acc.sold_at ? new Date(acc.sold_at).toLocaleString('id-ID') : '-'}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `laporan_penjualan_gamevault_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { success: true, message: 'File CSV laporan berhasil di-download!' };
};
