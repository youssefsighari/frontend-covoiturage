import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/customers'; // URL corrigée

  constructor(private http: HttpClient) {}

  addMiniBio(userId: number, miniBio: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'text/plain',
    };
    return this.http.post(`${this.baseUrl}/${userId}/add-minibio`, miniBio, { headers });
  }
  
  
  getMiniBios(userId: number): Observable<string[]> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    };
    return this.http.get<string[]>(`${this.baseUrl}/${userId}/minibios`, { headers });
  }
  
  deleteMiniBio(userId: number, miniBio: string): Observable<any> {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  };

  const encodedMiniBio = encodeURIComponent(miniBio); // Encode le paramètre
  return this.http.delete(`${this.baseUrl}/${userId}/delete-minibio?miniBio=${encodedMiniBio}`, {
    headers,
  });
}

  
  

  updatePassword(userId: number, newPassword: string, confirmPassword: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Inclure le token d'authentification
    };
  
    const body = { newPassword, confirmPassword };
  
    return this.http.put(`${this.baseUrl}/${userId}/update-password`, body, { headers });
  }
  

  updateCustomerDetails(userId: number, updatedData: any): Observable<any> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    };
  
    // Ajouter le chemin /update à l'URL
    return this.http.put(`${this.baseUrl}/${userId}/update`, updatedData, { headers });
  }
  
  
  
  

  getCustomerDetails2(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/details/${id}`); // Appelle l'endpoint du DTO
  }

  // Méthode pour uploader une photo
  uploadProfilePhoto(userId: number, file: File): Observable<{ message: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
  
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Récupérer le token du localStorage
    };
  
    return this.http.post<{ message: string; fileName: string }>(
      `${this.baseUrl}/${userId}/upload-photo`,
      formData,
      { headers }
    );
  }
  
  

  getProfilePhoto(fileName: string): Observable<Blob> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Ajout de l'authentification
    };
  
    return this.http.get(`${this.baseUrl}/profile-photo/${fileName}`, {
      headers,
      responseType: 'blob', // Pour recevoir le fichier en tant que blob
    });
  }
  
  // Méthode pour vérifier si une photo existe
  checkPhotoExists(fileName: string): Observable<boolean> {
    return this.http.head<boolean>(`${this.baseUrl}/profile-photo/${fileName}`);
  }

  getCustomerDetails(userId: number): Observable<any> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Ajout de l'authentification
    };
    return this.http.get(`${this.baseUrl}/${userId}`, { headers });
  }
  
}
