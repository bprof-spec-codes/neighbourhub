import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { Resident } from '../../entities/models/resident.model';
import { ResidentService } from '../../services/resident.service';
import { AdminUpdateResidentDto } from '../../entities/dtos/admin-update-resident-dto.model';

type ResidentViewModel = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImagePath: string | null;
  apartmentNumber: string;
  parkingSpace: string;
  storage: string;
};

type ResidentDraft = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImagePath: string | null;
  apartmentNumber: string;
  parkingSpace: string;
  storage: string;
};

@Component({
  selector: 'app-residents',
  standalone: false,
  templateUrl: './residents.component.html',
  styleUrl: './residents.component.scss'
})
export class ResidentsComponent implements OnInit {
  @ViewChild('residentProfileImageInput') residentProfileImageInput?: ElementRef<HTMLInputElement>;

  protected residents$ = new Observable<ResidentViewModel[]>();

  protected isEditModalOpen = false;
  protected editDraft: ResidentDraft | null = null;
  protected saveErrorMessage = '';
  protected isUploadingProfileImage = false;

  private selectedResidentId: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly residentService: ResidentService,
    private readonly translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.loadResidents();
  }

  private loadResidents(): void {
    this.residents$ = this.residentService.residents$.pipe(
      map((residents) => residents.map((resident) => this.toViewModel(resident)))
    );
    this.residentService.loadResidents();
  }

  private toViewModel(resident: Resident): ResidentViewModel {
    return {
      id: resident.id,
      firstName: resident.firstName,
      lastName: resident.lastName,
      email: resident.email,
      phoneNumber: resident.phoneNumber,
      profileImagePath: resident.profileImagePath,
      apartmentNumber: this.joinCodes(resident.apartmentNumber),
      parkingSpace: this.joinCodes(resident.parkingSpace),
      storage: this.joinCodes(resident.storage)
    };
  }

  private joinCodes(codes: string[]): string {
    return codes.length > 0 ? codes.join(', ') : '-';
  }

  private splitCodes(text: string): string[] {
    return text
      .split(/[|,]/)
      .map((code) => code.trim())
      .filter((code) => code.length > 0);
  }

  protected getCodeTags(text: string): string[] {
    return this.splitCodes(text);
  }

  protected get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  protected getResidentInitial(firstName: string, lastName: string): string {
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName.charAt(0).toUpperCase();
  }

  protected getResidentName(resident: ResidentViewModel): string {
    return `${resident.firstName} ${resident.lastName}`.trim();
  }

  protected getResidentProfileImageUrl(profileImagePath: string | null): string | null {
    if (!profileImagePath || profileImagePath.trim().length === 0) {
      return null;
    }

    if (profileImagePath.startsWith('http://') || profileImagePath.startsWith('https://')) {
      return profileImagePath;
    }

    return this.residentService.resolveApiUrl(profileImagePath);
  }

  protected openEditModal(resident: ResidentViewModel): void {
    if (!this.isAdmin) {
      return;
    }

    this.saveErrorMessage = '';
    this.isUploadingProfileImage = false;
    this.selectedResidentId = resident.id;
    this.editDraft = {
      firstName: resident.firstName,
      lastName: resident.lastName,
      email: resident.email,
      phoneNumber: resident.phoneNumber,
      profileImagePath: resident.profileImagePath,
      apartmentNumber: resident.apartmentNumber === '-' ? '' : resident.apartmentNumber.replace(/,\s*/g, ' | '),
      parkingSpace: resident.parkingSpace === '-' ? '' : resident.parkingSpace.replace(/,\s*/g, ' | '),
      storage: resident.storage === '-' ? '' : resident.storage.replace(/,\s*/g, ' | ')
    };
    this.isEditModalOpen = true;
  }

  protected closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedResidentId = null;
    this.editDraft = null;
    this.saveErrorMessage = '';
    this.isUploadingProfileImage = false;
  }

  protected onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file || !this.editDraft || this.selectedResidentId === null) {
      return;
    }

    this.isUploadingProfileImage = true;
    this.saveErrorMessage = '';

    this.residentService.uploadResidentProfileImage(
      this.selectedResidentId,
      file,
      (profileImagePath) => {
        if (this.editDraft) {
          this.editDraft.profileImagePath = profileImagePath;
        }
        this.isUploadingProfileImage = false;
        this.residentService.loadResidents();
      },
      (error) => {
        this.isUploadingProfileImage = false;
        this.saveErrorMessage = this.readErrorMessage(error);
      }
    );

    input.value = '';
  }

  protected openProfileImagePicker(): void {
    this.residentProfileImageInput?.nativeElement.click();
  }

  protected saveResidentChanges(): void {
    if (!this.isAdmin) {
      return;
    }

    if (!this.editDraft || this.selectedResidentId === null || this.isDraftInvalid(this.editDraft)) {
      return;
    }

    const dto = new AdminUpdateResidentDto(
      this.editDraft.firstName.trim(),
      this.editDraft.lastName.trim(),
      this.editDraft.email.trim(),
      this.editDraft.phoneNumber.trim(),
      this.splitCodes(this.editDraft.apartmentNumber),
      this.splitCodes(this.editDraft.parkingSpace),
      this.splitCodes(this.editDraft.storage)
    );

    this.residentService.updateResident(
      this.selectedResidentId,
      dto,
      () => this.closeEditModal(),
      (error) => {
        this.saveErrorMessage = this.readErrorMessage(error);
      }
    );
  }

  private readErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.translate.instant('RESIDENTS.UPDATE_FAILED');
    }

    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    if (Array.isArray(error.error) && error.error.length > 0) {
      return String(error.error[0]);
    }

    return this.translate.instant('RESIDENTS.UPDATE_FAILED');
  }

  protected isDraftInvalid(draft: ResidentDraft): boolean {
    return (
      draft.firstName.trim().length === 0 ||
      draft.lastName.trim().length === 0 ||
      draft.email.trim().length === 0 ||
      draft.phoneNumber.trim().length === 0 ||
      draft.apartmentNumber.trim().length === 0
    );
  }

}
