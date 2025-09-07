// libros.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LibrosService } from './libros-service';
import { environment } from '../../../environments/environment';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';



describe('LibrosService', () => {
    
  let service: LibrosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LibrosService,
        provideZonelessChangeDetection(),             
        provideHttpClient(withInterceptorsFromDi()),  
        provideHttpClientTesting(),                   // mock backend
      ],
    });

    service = TestBed.inject(LibrosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST multipart/form-data to /Libros', () => {
    const fakeFile = new File([new Blob(['img-bytes'])], 'ramen.jpg', { type: 'image/jpeg' });
    const dto = {
      titulo: '¡Ramen!',
      autor: 'Hugh Amano',
      description: 'desc',
      extendedDescription: 'ext desc',
      unitPrice: 19.97,
      genreId: 2,
      image: fakeFile,
      isbn: '9788448026752',
      disponible: true,
    };

    let returnedId: string | undefined;
    service.createNewLibro(dto).subscribe(id => (returnedId = id));

    const req = httpMock.expectOne(environment.baseUrl + 'Libros');
    expect(req.request.method).toBe('POST');
    // Body es FormData
    const body = req.request.body as FormData;
    expect(body instanceof FormData).toBeTrue();
    expect(body.get('Titulo')).toBe('¡Ramen!');
    expect(body.get('Autor')).toBe('Hugh Amano');
    expect(body.get('UnitPrice')).toBe('19.97');
    expect(body.get('GenreId')).toBe('2');
    expect(body.get('ISBN')).toBe('9788448026752');
    expect(body.get('Disponible')).toBe('true');
    expect(body.get('Image')).toBeTruthy(); // File adjunto

    // Emula respuesta de tu API
    req.flush({ data: 'LBR0005', success: true, errorMessage: null });

    expect(returnedId).toBe('LBR0005');
  });
});
