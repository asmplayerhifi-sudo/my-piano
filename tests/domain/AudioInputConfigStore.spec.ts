import { describe, it, expect, beforeEach } from 'vitest';
import { audioInputConfigStore } from '../../src/core/audioInputConfigStore';

describe('AudioInputConfigStore', () => {
  beforeEach(() => {
    audioInputConfigStore.setSelectedDeviceId('');
    audioInputConfigStore.setSensitivityPercent(50);
  });

  it('should initialize with default sensitivity and empty device ID', () => {
    const snapshot = audioInputConfigStore.getSnapshot();
    expect(snapshot.selectedDeviceId).toBe('');
    expect(snapshot.sensitivityPercent).toBe(50);
  });

  it('should update selectedDeviceId and notify subscribers', () => {
    let notified = 0;
    const unsub = audioInputConfigStore.subscribe(() => {
      notified++;
    });

    audioInputConfigStore.setSelectedDeviceId('usb-audio-card-01');
    expect(audioInputConfigStore.getSnapshot().selectedDeviceId).toBe('usb-audio-card-01');
    expect(notified).toBe(1);

    unsub();
    audioInputConfigStore.setSelectedDeviceId('mic-built-in');
    expect(notified).toBe(1); // Unsubscribed, should not increment
  });

  it('should clamp sensitivity percent between 10 and 100', () => {
    audioInputConfigStore.setSensitivityPercent(150);
    expect(audioInputConfigStore.getSnapshot().sensitivityPercent).toBe(100);

    audioInputConfigStore.setSensitivityPercent(5);
    expect(audioInputConfigStore.getSnapshot().sensitivityPercent).toBe(10);

    audioInputConfigStore.setSensitivityPercent(68);
    expect(audioInputConfigStore.getSnapshot().sensitivityPercent).toBe(68);
  });

  it('should apply presets correctly (low=25, normal=50, high=75)', () => {
    audioInputConfigStore.setPreset('low');
    expect(audioInputConfigStore.getSnapshot().sensitivityPercent).toBe(25);

    audioInputConfigStore.setPreset('high');
    expect(audioInputConfigStore.getSnapshot().sensitivityPercent).toBe(75);

    audioInputConfigStore.setPreset('normal');
    expect(audioInputConfigStore.getSnapshot().sensitivityPercent).toBe(50);
  });

  it('should maintain stable object reference when state does not change (useSyncExternalStore rule)', () => {
    const s1 = audioInputConfigStore.getSnapshot();
    const s2 = audioInputConfigStore.getSnapshot();
    expect(s1).toBe(s2); // Strict reference equality check!

    // Setting the same device ID should not change reference
    audioInputConfigStore.setSelectedDeviceId(s1.selectedDeviceId);
    const s3 = audioInputConfigStore.getSnapshot();
    expect(s3).toBe(s1);

    // Setting the same sensitivity should not change reference
    audioInputConfigStore.setSensitivityPercent(s1.sensitivityPercent);
    const s4 = audioInputConfigStore.getSnapshot();
    expect(s4).toBe(s1);
  });
});
