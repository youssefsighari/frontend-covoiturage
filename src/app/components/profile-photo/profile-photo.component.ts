import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss'],
})
export class ProfilePhotoComponent implements OnInit {
  selectedFile: File | null = null; // Le fichier sélectionné
  previewUrl: string | null = null; // Aperçu de l'image avant upload
  profilePhotoUrl: string | null = null; // URL de la photo de profil après upload
  userId = 1; // ID de l'utilisateur (peut être dynamique)
  username: string | null = null; // Nom de l'utilisateur connecté

  isModalOpen = false; 
  customerData: any = null; // Données utilisateur actuelles
  updatedCustomerData: any = {}; // Données mises à jour
  isEditing = false; // Mode édition

  isPasswordModalOpen = false; // État pour le modal de modification du mot de passe
  newPassword: string = ''; // Nouveau mot de passe
  confirmPassword: string = ''; // Confirmation du mot de passe
  passwordUpdateError: string = '';

  isMiniBioModalOpen: boolean = false;
miniBios: string[] = [];
newMiniBio: string = '';

showDeleteIcon: boolean[] = [];
  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }


    this.loadUserProfilePhoto(); // Charger la photo au démarrage
    this.loadUsernameFromLocalStorage(); // Charger le nom de l'utilisateur
    this.loadMiniBios();
    this.loadProfileFromRoute(); 
  }

  loadProfileFromRoute(): void {
    this.route.params.subscribe((params) => {
      const creatorId = +params['id']; // Récupérer l'ID depuis l'URL
      if (creatorId) {
        this.userId = creatorId; // Mettre à jour l'ID utilisateur
        this.loadUserProfilePhoto(); // Charger la photo de profil du créateur
        this.loadMiniBios(); // Charger les minibios si nécessaires
      }
    });
  }
  

  deleteSpecificMiniBio(miniBio: string) {
    const trimmedMiniBio = miniBio.trim(); // Nettoyage des espaces éventuels
    const initialMiniBios = [...this.miniBios]; // Sauvegarder l'état initial pour rollback en cas d'erreur
  
    // Supprimer immédiatement le minibio de la liste locale pour refléter le changement dans l'interface
    this.miniBios = this.miniBios.filter((bio) => bio !== trimmedMiniBio);
  
    this.userService.deleteMiniBio(this.userId, trimmedMiniBio).subscribe({
      next: () => {
        console.log(`Mini-bio supprimée avec succès : ${trimmedMiniBio}`);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du minibio :', err);
        // Restaurer l'état initial si une erreur survient
        this.miniBios = initialMiniBios;
      },
    });
  }
  
  

  
  

openMiniBioModal() {
  this.isMiniBioModalOpen = true;
  this.loadMiniBios();
}

closeMiniBioModal() {
  this.isMiniBioModalOpen = false;
  this.newMiniBio = '';
}

loadMiniBios() {
  this.userService.getMiniBios(this.userId).subscribe({
    next: (bios) => {
      this.miniBios = bios;
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des minibios :', err);
    },
  });
}

saveMiniBio() {
  if (!this.newMiniBio.trim()) {
    console.error('La minibio ne peut pas être vide.');
    return;
  }

  this.userService.addMiniBio(this.userId, this.newMiniBio).subscribe({
    next: () => {
      this.miniBios.push(this.newMiniBio); // Ajouter la minibio localement
      this.closeMiniBioModal(); // Fermer la modal après l'enregistrement
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout de la minibio :', err);
    },
  });
}


  loadUserProfilePhoto() {
    this.userService.getCustomerDetails(this.userId).subscribe({
      next: (customer) => {
        if (customer.profilePhoto) {
          // Récupérer la photo si elle existe
          this.userService.getProfilePhoto(customer.profilePhoto).subscribe({
            next: (blob) => {
              const url = URL.createObjectURL(blob); // Générer une URL temporaire
              this.profilePhotoUrl = url;
            },
            error: (err) =>
              console.error('Erreur lors du chargement de la photo :', err),
          });
        }
      },
      error: (err) =>
        console.error(
          'Erreur lors de la récupération des détails utilisateur :',
          err
        ),
    });
  }

  loadUsernameFromLocalStorage() {
    this.username = localStorage.getItem('username'); // Récupérer le nom de l'utilisateur depuis le localStorage
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click(); // Déclenche l'ouverture de l'input file masqué
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0]; // Assigner le fichier sélectionné
      this.uploadPhoto(); // Téléverser automatiquement après la sélection
    }
  }

  uploadPhoto() {
    if (this.selectedFile !== null) {
      this.userService.uploadProfilePhoto(this.userId, this.selectedFile).subscribe({
        next: (response) => {
          if (response && response.fileName) {
            // Charger la photo après l'upload
            this.userService.getProfilePhoto(response.fileName).subscribe({
              next: (blob) => {
                const url = URL.createObjectURL(blob);
                this.profilePhotoUrl = url;
              },
              error: (err) =>
                console.error('Erreur lors de la récupération de la photo :', err),
            });
          }
        },
        error: (err) =>
          console.error('Erreur lors de l\'upload :', err),
      });
    } else {
      console.error('Aucun fichier sélectionné !');
    }
  }

  openModal() {
    this.isModalOpen = true;

    this.userService.getCustomerDetails(this.userId).subscribe({
      next: (data) => {
        this.customerData = data; // Assigne les données au moment de la réponse
        this.updatedCustomerData = { ...data }; // Pré-remplir les champs d'édition
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données utilisateur :', err);
      },
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditing = false; // Désactiver le mode édition
  }

  enableEditMode() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.updatedCustomerData = { ...this.customerData }; // Réinitialiser les données modifiées
  }

  saveChanges() {
    this.userService.updateCustomerDetails(this.userId, this.updatedCustomerData).subscribe({
      next: (response) => {
        this.customerData = response;
        this.isEditing = false;
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour des données utilisateur :', err);
      },
    });
  }

  openPasswordModal() {
    this.isPasswordModalOpen = true;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordUpdateError = '';
  }

  closePasswordModal() {
    this.isPasswordModalOpen = false;
  }

  updatePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.passwordUpdateError = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordUpdateError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.userService.updatePassword(this.userId, this.newPassword,this.confirmPassword).subscribe({
      next: () => {
        this.closePasswordModal();
      },
      error: (err) => {
        this.passwordUpdateError = 'Erreur lors de la mise à jour du mot de passe.';
      },
    });
  }
}
