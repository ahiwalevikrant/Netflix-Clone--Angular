import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { BannerComponent } from 'src/app/core/components/banner/banner.component';
import { MovieService } from 'src/app/shared/services/movie.service';
import { MovieCarouselComponent } from 'src/app/shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from 'src/app/shared/models/video-content.interface';
import { Observable, forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [HeaderComponent,BannerComponent,MovieCarouselComponent,CommonModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css',
})
export class BrowseComponent implements OnInit {

  auth = inject(AuthService);
  movieService=inject(MovieService);

  name=JSON.parse(sessionStorage.getItem("LoggedUser")!).name;
  userProfileImg=JSON.parse(sessionStorage.getItem("LoggedUser")!).picture;
  email=JSON.parse(sessionStorage.getItem("LoggedUser")!).email;
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];


  sources=[
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getRatedMovies(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ]
  ngOnInit(): void {
    forkJoin(this.sources)
    .pipe(
      map(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated])=>{
     this.bannerDetail$=  this.movieService.getBannerDetail(movies.results[0].id)
     this.bannerVideo$=  this.movieService.getBannerVideo(movies.results[0].id)
        return {movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated}
      })
    ).subscribe((res:any)=>{
      this.movies = res.movies.results as IVideoContent[];
      this.tvShows = res.tvShows.results as IVideoContent[];
      this.ratedMovies = res.ratedMovies.results as IVideoContent[];
      this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
      this.upcomingMovies = res.upcoming.results as IVideoContent[];
      this.popularMovies = res.popular.results as IVideoContent[];
      this.topRatedMovies = res.topRated.results as IVideoContent[];
      
    })
  }
  getMovieKey() {
    this.movieService.getBannerVideo(this.movies[0].id)
    .subscribe(res=>{
      console.log(res);
    })
  }
  signOut() {
    sessionStorage.removeItem('LoggedUser');
    this.auth.signout();
  }

  
}
