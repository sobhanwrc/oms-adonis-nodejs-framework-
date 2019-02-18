import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'wa', src:'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js' },
  { name: 'a', src: 'assets/userdash/plugins/node-waves/waves.js' },
  { name: 'b', src: 'assets/userdash/js/admin.js' }
  // { name: 'u', src:'assets/userdash/plugins/node-waves/waves.js' },
  // { name: 't', src:'assets/userdash/plugins/jquery-validation/jquery.validate.js' },
  // { name: 's', src:'assets/userdash/js/admin.js' },
  // { name: 'r', src:'assets/userdash/js/pages/examples/sign-in.js' },
  // { name: 'q', src:'assets/userdash/plugins/bootstrap-select/js/bootstrap-select.js' },
  // { name: 'p', src:'assets/userdash/plugins/jquery-slimscroll/jquery.slimscroll.js' },
  // { name: 'o', src:'assets/userdash/plugins/node-waves/waves.js' },
  // { name: 'n', src:'assets/userdash/plugins/autosize/autosize.js' },
  // { name: 'm', src:'assets/userdash/plugins/momentjs/moment.js' },
  // { name: 'l', src:'assets/userdash/plugins/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js' },
  // { name: 'k', src:'assets/userdash/plugins/jquery-datatable/jquery.dataTables.js' },
  // { name: 'j', src:'assets/userdash/plugins/jquery-datatable/skin/bootstrap/js/dataTables.bootstrap.js' },
  // { name: 'i', src:'assets/userdash/plugins/jquery-datatable/extensions/export/dataTables.buttons.min.js' },
  // { name: 'h', src:'assets/userdash/plugins/jquery-datatable/extensions/export/buttons.flash.min.js' },
  // { name: 'g', src:'assets/userdash/plugins/jquery-datatable/extensions/export/jszip.min.js' },
  // { name: 'f', src:'assets/userdash/plugins/jquery-datatable/extensions/export/pdfmake.min.js' },
  // { name: 'e', src:'assets/userdash/plugins/jquery-datatable/extensions/export/vfs_fonts.js' },
  // { name: 'd', src:'assets/userdash/plugins/jquery-datatable/extensions/export/buttons.html5.min.js' },
  // { name: 'c', src:'assets/userdash/plugins/jquery-datatable/extensions/export/buttons.print.min.js' },
  // { name: 'b', src:'assets/userdash/js/pages/tables/jquery-datatable.js' },
  // { name: 'a', src:'assets/userdash/js/pages/forms/basic-form-elements.js' }
 
];

declare var document: any;

@Injectable()
export class DynamicScriptLoaderService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});

                }
            };
        } else {  //Others
            script.onload = () => {
                this.scripts[name].loaded = true;
                resolve({script: name, loaded: true, status: 'Loaded'});
            };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

}