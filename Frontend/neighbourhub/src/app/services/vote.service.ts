import { Injectable } from '@angular/core';
import { VoteBackendService } from '../backend/vote-backend.service';
import { BehaviorSubject } from 'rxjs';
import { Vote } from '../entities/models/vote.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { VoteAddDto } from '../entities/dtos/vote-add-dto.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private votes = new BehaviorSubject<Vote[]>([]);
  public votes$ = this.votes.asObservable();

  constructor(private voteBackendService: VoteBackendService) {}

  public loadVotes(): void {
    this.voteBackendService.getVotes().pipe(untilDestroyed(this)).subscribe({
      next: (votes) => this.votes.next(votes),
      error: (err) => console.error('Failed to load votes', err)
    });
  }

  public deleteVote(id: string): void {
    this.voteBackendService.deleteVoteById(id).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadVotes(),
      error: (err) => console.error('Failed to delete vote', err)
    });
  }

  public addVote(voteToAdd: VoteAddDto): void {
    this.voteBackendService.addVote(voteToAdd).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadVotes(),
      error: (err) => console.error('Failed to add vote', err)
    });
  }

  public castVote(voteId: string, option: number): void {
    this.voteBackendService.castVote(voteId, option).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadVotes(),
      error: (err) => console.error('Failed to cast vote', err)
    });
  }
}