import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test-utils';
import { AIPredictionCard } from '@/components/ai/AIPredictionCard';
import { ConfidenceScoreIndicator } from '@/components/ai/ConfidenceScoreIndicator';

describe('AI Detection & Prediction Components Test Suite', () => {
  describe('ConfidenceScoreIndicator Component', () => {
    it('calculates percentage correctly and renders high confidence styling', () => {
      renderWithProviders(<ConfidenceScoreIndicator confidence={0.88} size="md" showLabel={true} />);
      
      expect(screen.getByText('High Confidence')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '88');
    });

    it('renders medium and low confidence styling based on thresholds', () => {
      const { rerender } = renderWithProviders(<ConfidenceScoreIndicator confidence={0.65} showLabel={true} />);
      expect(screen.getByText('Medium Confidence')).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument();

      rerender(<ConfidenceScoreIndicator confidence={0.32} showLabel={true} />);
      expect(screen.getByText('Low Confidence')).toBeInTheDocument();
      expect(screen.getByText('32%')).toBeInTheDocument();
    });
  });

  describe('AIPredictionCard Component', () => {
    it('renders prediction, translation text, status label, and confidence indicator', () => {
      renderWithProviders(
        <AIPredictionCard
          prediction="HELLO"
          translationText="Hello, welcome!"
          confidence={0.92}
          timestamp="12:45 PM"
          status="success"
        />
      );

      expect(screen.getByText('Confirmed Sign')).toBeInTheDocument();
      expect(screen.getByText('HELLO')).toBeInTheDocument();
      expect(screen.getByText('Hello, welcome!')).toBeInTheDocument();
      expect(screen.getByText('12:45 PM')).toBeInTheDocument();
      expect(screen.getByText('92%')).toBeInTheDocument();
    });

    it('triggers onPlaySpeech callback when audio button is clicked', () => {
      const handlePlaySpeech = vi.fn();
      renderWithProviders(
        <AIPredictionCard
          prediction="THANK YOU"
          translationText="Thank you very much"
          confidence={0.85}
          timestamp="1:00 PM"
          status="success"
          onPlaySpeech={handlePlaySpeech}
          isSpeaking={false}
        />
      );

      const playBtn = screen.getByRole('button');
      fireEvent.click(playBtn);
      expect(handlePlaySpeech).toHaveBeenCalledTimes(1);
    });

    it('renders error status styling when status is error', () => {
      renderWithProviders(
        <AIPredictionCard
          prediction="None"
          translationText=""
          confidence={0.1}
          timestamp="1:05 PM"
          status="error"
        />
      );

      expect(screen.getByText('Detection Error')).toBeInTheDocument();
    });
  });
});
