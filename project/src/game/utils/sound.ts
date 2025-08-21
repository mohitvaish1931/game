import { Scene } from 'phaser';

export class SoundManager {
  private scene: Scene;
  private musicVolume: number = 0.6;
  private sfxVolume: number = 0.8;
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private muted: boolean = false;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.setVolume(this.muted ? 0 : this.musicVolume);
    }
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  public playMusic(key: string, loop: boolean = true): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
    }

    if (this.scene.sound.get(key)) {
      this.currentMusic = this.scene.sound.add(key, {
        volume: this.muted ? 0 : this.musicVolume,
        loop
      });
      this.currentMusic.play();
    }
  }

  public stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  public playSfx(key: string, volume?: number): void {
    if (this.muted) return;

    const actualVolume = volume !== undefined ? volume : this.sfxVolume;
    if (this.scene.sound.get(key)) {
      this.scene.sound.play(key, { volume: actualVolume });
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    
    if (this.currentMusic) {
      this.currentMusic.setVolume(this.muted ? 0 : this.musicVolume);
    }
    
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }
}