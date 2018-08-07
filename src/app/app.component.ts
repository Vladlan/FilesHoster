import {Component} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFile: File = null;

  constructor(private http: HttpClient) {
  }

  onFileSelected(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      console.log('fd: ', fd);
      console.log('selectedFile: ', this.selectedFile);
      this.http.post('http://localhost:3000/upload', fd, {
        reportProgress: true, observe: 'events'
      })
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            console.log(event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            console.log(event);
            let link = document.getElementById('link');
            let url = 'http://localhost:3000/images/' + event.body["file"].filename;
            link.innerHTML = `<a href=${url} target=url>${url}</a>`;
          }
        });
    }
  }
}
