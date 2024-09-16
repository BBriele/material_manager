const materiali = await Materiale.aggregate([
    {
      $lookup: {
        from: 'movimenti',
        localField: 'codice',
        foreignField: 'codice',
        as: 'movimenti'
      }
    },
    {
      $unwind: '$movimenti'
    },
    {
      $sort: {
        'movimenti.data': -1
      }
    },
    {
      $group: {
        _id: '$codice',
        descrizione: '$descrizione',
        fornitore: '$fornitore',
        giacenza_minima: '$giacenza_minima',
        reparto: '$reparto',
        tempoConsegna: '$tempoConsegna',
        giacenza: {
          $last: '$movimenti.giacenza_aspettata'
        }
      }
    }
  ]);

//------------------------------------------------------------------------------------------------------

const aggregazione = {
    $lookup: {
      from: 'movimenti',
      localField: 'codice',
      foreignField: 'codice',
      as: 'movimenti'
    },
    $unwind: '$movimenti',
    $sort: {
      'movimenti.data': -1
    },
    $limit: 1,
    $project: {
      _id: 0,
      codice: 1,
      descrizione: 1,
      fornitore: 1,
      giacenza_minima: 1,
      reparto: 1,
      tempoConsegna: 1,
      giacenza: '$movimenti.giacenza_aspettata'
    }
  };
  
  const risultati = await Materiale.aggregate(aggregazione);

//------------------------------------------------------------------------------------------------------