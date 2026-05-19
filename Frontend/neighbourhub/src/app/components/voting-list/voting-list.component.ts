import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Vote } from '../../entities/models/vote.model';
import { VoteService } from '../../services/vote.service';
import { VoteAddDto } from '../../entities/dtos/vote-add-dto.model';
import { VoteOption } from '../../entities/enums/vote-option.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-voting-list',
  standalone: false,
  templateUrl: './voting-list.component.html',
  styleUrl: './voting-list.component.scss'
})
export class VotingListComponent implements OnInit {

  protected votes$ = new Observable<Vote[]>();
  protected isAddModalOpen = false;
  protected isDeleteModalOpen = false;
  protected isVoteModalOpen = false;
  protected selectedVoteId: string = '';

  private idToDelete: string = '';

  protected currentUserId: string | null = null;
  protected isAdmin: boolean = false;

  constructor(private voteService: VoteService,private authService: AuthService){

    this.currentUserId = this.authService.getUserId();
    this.isAdmin = this.authService.isAdmin();
  }

  public ngOnInit(): void {
    this.loadVotes();
  }

  private loadVotes(): void {
    this.voteService.loadVotes();
    this.votes$ = this.voteService.votes$;
  }


  protected openAddModal(): void {
    this.isAddModalOpen = true;
  }
  protected closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  protected addVote(voteToAdd: VoteAddDto): void {
    this.voteService.addVote(voteToAdd);
    this.closeAddModal();
}

  protected openDeleteModal(id: string): void {
    this.isDeleteModalOpen = true;
    this.idToDelete = id;
  }

  protected closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  protected deleteVote(): void {
    if (this.idToDelete === '') {
      console.error('No vote ID specified for deletion.');
      return;
    }
    
    this.voteService.deleteVote(this.idToDelete);
    this.closeDeleteModal();
  }

  protected castVote(voteId: string, option: VoteOption): void {
    this.voteService.castVote(voteId, option);
  }


  protected getVoteTotal(vote: Vote): number {
    return vote.yesCount + vote.noCount + vote.abstainCount;
  }

  protected getPercentage(count: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }

  protected isActive(vote: Vote): boolean {
    return new Date(vote.deadline) > new Date();
  }


  protected openVoteModal(id: string): void {
  this.isVoteModalOpen = true;
  this.selectedVoteId = id;
}

protected closeVoteModal(): void {
  this.isVoteModalOpen = false;
  this.selectedVoteId = '';
}

protected onVoteCast(option: VoteOption): void {
  this.voteService.castVote(this.selectedVoteId, option);
  this.closeVoteModal();
}

}
