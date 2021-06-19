import { Injectable } from '@angular/core';
import { PoModal } from '../modals/PoModal';

@Injectable({
  providedIn: 'root'
})
export class PdfServiceService {

  pdfMake: any;

  constructor() { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdfPurchaseModal(poModal: PoModal) {
    await this.loadPdfMaker();
    var poDate = new Date(poModal.poDate.toDate());
    var poString = poDate.getDate() + "-" + (poDate.getMonth() + 1) + "-" + poDate.getFullYear();
    var bodyMaterials = [];
    bodyMaterials.push([
      { text: 'Sl.', style: 'smallBold' },
      { text: 'ITEM', style: 'smallBold' },
      { text: 'MATERIAL DESCRIPTION', style: 'smallBold', rowSpan: 2, colSpan: 2, alignment: 'center' },
      {},
      { text: 'QTY', style: 'smallBold' },
      { text: 'UNIT', style: 'smallBold' },
      { text: 'RATE EACH', colSpan: 2, style: 'smallBold', alignment: 'center' },
      '',
      { text: 'VALUE', colSpan: 2, style: 'smallBold', alignment: 'center' },
      ''
    ]);
    bodyMaterials.push([
      { text: 'No.', style: 'smallBold' },
      { text: 'CODE', style: 'smallBold' },
      { text: '', colSpan: 2 },
      {},
      { text: '' },
      { text: '' },
      { text: 'Rs.', style: 'smallBold' },
      { text: 'Ps.', style: 'smallBold' },
      { text: 'Rs.', style: 'smallBold' },
      { text: 'Ps.', style: 'smallBold' },
    ])
    poModal.materials.forEach((material, index) => {
      bodyMaterials.push([
        { text: "" + (index + 1), style: 'smallBold' },
        { text: '' },
        { text: material.name, style: 'smallBold', colSpan: 2 },
        { text: '' },
        { text: material.quantity, style: 'smallBold' },
        { text: material.unit, style: 'smallBold' },
        { text: ("" + material.price).split(".")[0], style: 'smallBold' },
        { text: ("" + material.price).split(".")[1], style: 'smallBold' },
        { text: ("" + material.value).split(".")[0], style: 'smallBold' },
        { text: ("" + material.value).split(".")[1], style: 'smallBold' }
      ]);
    });
    bodyMaterials.push([
      {text: ''},
      {text: ''},
      {text: 'BASIC VALUE', alignment: 'right', colSpan: 6, style: 'smallBoldLfont'},
      {},
      {},
      {},
      {},
      {},
      {text: ''+poModal.totalCost, alignment: 'right', colSpan: 2, style: 'smallBoldLfont'},
      {}
    ]);
    bodyMaterials.push([
      {text: ''},
      {text: ''},
      {text: 'GST @ '+poModal.gstPercentage+'%', alignment: 'right', colSpan: 6, style: 'smalsmallBoldLfontlBold'},
      {},
      {},
      {},
      {},
      {},
      {text: ''+poModal.totalGstValue, alignment: 'right', colSpan: 2, style: 'smallBoldLfont'},
      {}
    ]);
    bodyMaterials.push([
      {text: ''},
      {text: ''},
      {text: 'TOTAL VALUE', alignment: 'right', colSpan: 6, style: 'smallBoldLfont'},
      {},
      {},
      {},
      {},
      {},
      {text: ''+poModal.totalValueWithGst, alignment: 'right', colSpan: 2, style: 'smallBoldLfont'},
      {}
    ]);
    console.log(bodyMaterials);
    const def = {
      content: [
        { image: await this.getBase64ImageFromURL('../../../assets/logo/logo_new.png'), width: 70, height: 35, alignment: 'center' },
        { text: 'V-Ctrl Solutions Private Limited', style: 'normalHeader', alignment: 'center', margin: [0, 10, 0, 10], decoration: 'underline' },
        { text: '' + poModal.branch.branchhDescription, style: 'normalText', alignment: 'center' },
        { text: 'Email: ' + poModal.branch.branchEmail + ", Phone: " + poModal.branch.branchContact, style: 'normalText', alignment: 'center' },
        { text: 'PURCHASE ORDER', style: 'header', margin: [0, 10, 0, 10] },
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 0,
            widths: ['*', 'auto', 100, '*'],

            body: [
              [{ text: 'P.O.No :', bold: true }, { text: poModal.poNumber }, { text: 'P.O.DATE :', bold: true }, { text: poString }],
              [
                { text: 'TO:\n' + poModal.vendor.addr1 + "\n" + poModal.vendor.addr2 + "\n" + poModal.vendor.city + "\n" + poModal.vendor.state + "\n" + poModal.vendor.pincode, colSpan: 2, style: 'normalText' },
                {},
                { text: 'CIN NO : ' + poModal.vendor.cin_no + "\nGST NO: " + poModal.vendor.gst_no, colSpan: 2, style: 'normalText' },
                {}
              ], [
                { text: 'Please supply the following materials subject to terms & conditions set below and overleaf. Kindly acknowledge the receipt of this order.', style: 'normalText', colSpan: 4 }, {}, {}, {}
              ]
            ],
          },

        },
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 2,
            widths: ['*', 'auto', 100, '*', '*', '*', '*', '*', '*', '*'],

            body: bodyMaterials
          },

        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          decoration: 'underline'
        },
        normalHeader: {
          fontSize: 12,
          bold: true
        },
        normalText: {
          fontSize: 10,
          bold: false
        },
        smallBold: {
          fontSize: 8,
          bold: true
        },
        smallBoldLfont: {
          fontSize: 10,
          bold: true
        }
      }
    };
    this.pdfMake.createPdf(def).open();
  }




  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }
}
